import Login from "./components/Login";
import { useImmer } from "use-immer";
import client from "./lib/axios";

const App = () => {
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
    });

    console.log(response);
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
