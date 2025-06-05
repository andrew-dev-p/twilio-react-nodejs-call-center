import Login from "./components/Login";
import { useImmer } from "use-immer";
import client from "./lib/axios";
import socket from "./lib/socketio";
import { useEffect, useState } from "react";

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const [user, setUser] = useImmer({
    username: "",
    mobileNumber: "",
    verificationCode: "",
    verificationSent: false,
  });
  
  const sendSmsCode = async () => {
    await client.post("/login", {
      to: user.mobileNumber,
      username: user.username,
      channel: "sms",
    });

    setUser((draft) => {
      draft.verificationSent = true;
    });
  };

  const sendVerificationCode = async () => {
    const response = await client.post("/verify", {
      to: user.mobileNumber,
      code: user.verificationCode,
      username: user.username,
    });

    setToken(response.data.token);
  };

  return (
    <>
      <Login
        user={user}
        setUser={setUser}
        sendSmsCode={sendSmsCode}
        sendVerificationCode={sendVerificationCode}
      />
    </>
  );
};

export default App
