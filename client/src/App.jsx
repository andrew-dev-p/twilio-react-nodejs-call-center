import Login from "./components/Login";
import { useImmer } from "use-immer";
import client from "./lib/axios";
import socket from "./lib/socketio";
import { useState, useEffect } from "react";
import useTokenFromLocalStorage from "./hooks/useTokenFromLocalStorage";
import CallCenter from "./components/CallCenter";
import { Device } from "twilio-client";

const App = () => {
  const [calls, setCalls] = useImmer({
    calls: []
  });

  const [storedToken, setStoredToken, isValidToken] = useTokenFromLocalStorage(null);

  const [twilioToken, setTwilioToken] = useState(null);

  useEffect(() => {
    if (twilioToken) {
      connectTwilioVoiceClient(twilioToken);
    }
  }, [twilioToken]);

  useEffect(() => {
    if (isValidToken) {
      socket.addToken(storedToken);
    } else {
      socket.removeToken();
    }
  }, [isValidToken, storedToken]);

  useEffect(() => {
    socket.client.on("connect", () => {
      console.log("Connected to server");
    });

    socket.client.on("call-new", (data) => {
      setCalls((draft) => {
        draft.calls.push(data);
      });
    });

    socket.client.on("enqueue", (callData) => {
      setCalls((draft) => {
        const index = draft.calls.findIndex(({callSid}) => callSid === callData.CallSid);
        
        callData.data.CallStatus = "enqueue";
        draft.calls[index] = callData;
      });
    });

    socket.client.on("twilio-token", (data) => {
      setTwilioToken(data.token);
    })

    socket.client.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.client.off("connect");
      socket.client.off("disconnect");
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

  function connectTwilioVoiceClient(twilioToken) {
    const device = new Device(twilioToken, { debug: true });

    device.on('error', (error) => {
      console.error(error);
    });

    device.on('incoming', (connection) => {
      connection.accept();
    });
  }

  return (
    <div>
      {isValidToken ? (
        <CallCenter calls={calls} />
      ) : (
        <>
          <CallCenter calls={calls} />
          <Login
            user={user}
            setUser={setUser}
            sendSmsCode={sendSmsCode}
            sendVerificationCode={sendVerificationCode}
          />
        </>
      )}
    </div>
  );
};

export default App
