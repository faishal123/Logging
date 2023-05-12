import axios from "axios";

export const getUserProfile = (userAccessToken: string) => {
  return axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userAccessToken}`,
    {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        Accept: "application/json",
      },
    }
  );
};
