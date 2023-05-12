import { createContext, ReactNode, useEffect, useState } from "react";
import { useGyroscope } from "./gyroscope";
import { useWindowSize } from "./common";
import { getUserProfile } from "./google";
import { TokenResponse } from "@react-oauth/google";
import { createRecord, createTable, getRecords } from "./airtable";

export const WindowSizeContext = createContext({
  height: 0,
  style: {},
  styleStatic: {},
  firstRenderHeight: 0,
  windowWidth: 0,
  isLandscape: false,
  isPortrait: false,
});

type ContextProviderProps = {
  children: ReactNode;
};

export const WindowSizeContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [firstRenderHeight, setFirstRenderHeight] = useState(0);
  const { height: windowHeight, width: windowWidth } = useWindowSize();

  useEffect(() => {
    setFirstRenderHeight(windowHeight || 0);
  }, []);

  return (
    <WindowSizeContext.Provider
      value={{
        firstRenderHeight,
        height: windowHeight || 0,
        style: { height: `${windowHeight}px`, transition: "0.2s" },
        styleStatic: { height: `${firstRenderHeight}px`, transition: "0.2s" },
        windowWidth: windowWidth || 0,
        isLandscape: (windowHeight || 0) < (windowWidth || 0),
        isPortrait: (windowHeight || 0) > (windowWidth || 0),
      }}
    >
      {children}
    </WindowSizeContext.Provider>
  );
};

type GyroscopeContextType = {
  gamma: number | null | undefined;
  beta: number | null | undefined;
  x: number;
  y: number;
  supported: boolean;
  backgroundPositionX: string | undefined;
  backgroundPositionY: string | undefined;
  askPermission: () => void;
  allowed: boolean;
  clickToAskPermission: () => void;
  isLandscape: boolean;
  isPortrait: boolean;
};

export const GyroscopeContext = createContext<GyroscopeContextType>({
  gamma: 0,
  beta: 0,
  x: 0,
  y: 0,
  supported: false,
  backgroundPositionX: "0%",
  backgroundPositionY: "0%",
  askPermission: () => null,
  allowed: false,
  clickToAskPermission: () => null,
  isLandscape: false,
  isPortrait: false,
});

export const GyroscopeContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const gyroscopeDatas = useGyroscope({ useVerticalAxis: true });
  return (
    <GyroscopeContext.Provider value={gyroscopeDatas}>
      {children}
    </GyroscopeContext.Provider>
  );
};

type ProfileType = {
  email?: string;
  family_name?: string;
  given_name?: string;
  hd?: string;
  id?: string;
  link?: string;
  locale?: string;
  name?: string;
  picture?: string;
  verified_email?: boolean;
};

type UserDataContextType = {
  user: TokenResponse | null;
  setUser: React.Dispatch<React.SetStateAction<TokenResponse | null>>;
  profile: ProfileType;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType>>;
};

export const UserDataContext = createContext<UserDataContextType>({
  user: null,
  setUser: () => null,
  profile: {},
  setProfile: () => null,
});

export const UserDataContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<TokenResponse | null>(null);
  const [profile, setProfile] = useState<ProfileType>({});

  useEffect(() => {
    if (user) {
      getUserProfile(user.access_token)
        .then((res) => {
          const googleUserEmail = res?.data?.email;
          const googleUserId = res?.data?.id;
          const googleUserName = res?.data?.name;

          const callBack = () => {
            setProfile(res?.data);
          };

          getRecords("userTableMap", {
            sort: [{ field: "CreatedAt", direction: "desc" }],
          }).then((records) => {
            const userAlreadyRegistered =
              records.filter((r) => r.fields.googleUserId === googleUserId)
                .length > 0;

            if (!userAlreadyRegistered) {
              console.log("not registered");
              createTable({
                tableData: {
                  name: googleUserEmail,
                  description: googleUserName,
                  fields: [{ name: "date", type: "singleLineText" }],
                },
              })
                .then((createdTable) => {
                  const createdTableId = createdTable?.data?.id;
                  createRecord("userTableMap", {
                    googleUserId,
                    googleUserName,
                    googleUserEmail,
                    airtableTableId: createdTableId,
                  })
                    .then(() => {
                      callBack();
                    })
                    .catch((e) => {
                      console.error(e);
                    });
                })
                .catch((e) => {
                  console.error(e);
                });
            } else {
              callBack();
              console.log("already registered");
            }
          });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);
  return (
    <UserDataContext.Provider value={{ user, setUser, profile, setProfile }}>
      {children}
    </UserDataContext.Provider>
  );
};
