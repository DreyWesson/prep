import { useState, useEffect } from "react";
import { getPrivateData } from "../../api";

export const PrivateScreen = ({ history }) => {
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    }
    const fetchPrivateData = async () => {
      const authToken = localStorage.getItem("authToken");

      try {
        const { data } = await getPrivateData(authToken);
        setPrivateData(data?.data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized, please login");
      }
    };
    fetchPrivateData();
  }, [history]);

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
      <div style={{ background: "rgb(87, 207, 87)", color: "white" }}>
        {privateData}
      </div>
      <button onClick={logoutHandler}>Logout</button>
    </>
  );
};
