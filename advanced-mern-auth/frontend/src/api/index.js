import axios from "axios";

export const postData = (route, details) => {
  const data = axios.post(route, details, {
    header: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const resetPassword = (details, match) => {
  const data = axios.put(
    `/api/auth/resetpassword/${match.params.resetToken}`,
    details,
    {
      header: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const getPrivateData = (authToken) => {
  const data = axios.get("/api/private", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  return data;
};
