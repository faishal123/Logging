import React, { useContext, useState, useEffect } from "react";
import { UserDataContext } from "../../Utils/context";
import { googleLogout } from "@react-oauth/google";
import { createRecord, getRecords } from "../../Utils/airtable";
import moment from "moment";
import { createTable } from "../../Utils/airtable";

const Profile: React.FC = () => {
  const { profile, setProfile } = useContext(UserDataContext);
  const [nutsList, setNutsList] = useState<string[]>([]);

  const logOut = () => {
    googleLogout();
    setProfile({});
  };

  useEffect(() => {
    getRecords(profile?.email || "").then((res) => {
      setNutsList(res?.map((r) => `${r?.fields?.date}`));
    });
  }, []);

  return (
    <div>
      <img
        referrerPolicy="no-referrer"
        src={profile.picture}
        alt="user image"
      />
      <p>Name: {profile.name}</p>
      <button
        onClick={() => {
          const currentDate = moment(new Date()).format();
          createRecord(profile?.email || "", {
            date: currentDate,
          }).then(() => setNutsList((prev) => [...prev, currentDate]));
        }}
      >
        nut
      </button>
      <br />
      <button onClick={logOut}>Log out</button>
      <br />
      <br />
      <div style={{ maxHeight: "300px", overflow: "auto" }}>
        {nutsList?.map((nut, i) => {
          const nutDate = new Date(nut);
          return (
            <div key={`${nut}${i}`}>
              {i + 1}) {nutDate.toString()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
