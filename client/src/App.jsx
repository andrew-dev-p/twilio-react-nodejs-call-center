import Login from "./components/Login";
import useImmer from "use-immer";

const App = () => {
  const [user, setUser] = useImmer({
    username: "",
    mobileNumber: "",
    verificationCode: "",
    verificationSent: false,
  });
  
  const sendSmsCode = async () => {
    const response = await client.post("/login", {
      to: user.mobileNumber,
      username: user.username,
      channel: "sms",
    });
  };

  return (
    <>
      <Login user={user} setUser={setUser} sendSmsCode={sendSmsCode} />
    </>
  );
};

export default App
