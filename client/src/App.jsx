import Login from "./components/Login";
import { useImmer } from "use-immer";
import client from "./lib/axios";
import socket from "./lib/socketio";
import { useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import CallCenter from "./components/CallCenter";

const App = () => {
  const [calls, setCalls] = useImmer({
    calls: []
  });
  const [storedToken, setStoredToken] = useLocalStorage("token", null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("call-new", (data) => {
      setCalls((draft) => {
        draft.calls.push(data);
      });
    });

    socket.on("enqueue", (data) => {
      setCalls((draft) => {
        const index = draft.calls.findIndex(({callSid}) => callSid === data.CallSid);
        draft.calls[index] = data.CallStatus = "enqueue";
      });
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

    setStoredToken(response.data.token);
  };

  return (
    <div>
      {storedToken ? (
        <CallCenter calls={calls} />
      ) : (
        <Login
          user={user}
          setUser={setUser}
          sendSmsCode={sendSmsCode}
          sendVerificationCode={sendVerificationCode}
        />
      )}
    </div>
  );
};

export default App
