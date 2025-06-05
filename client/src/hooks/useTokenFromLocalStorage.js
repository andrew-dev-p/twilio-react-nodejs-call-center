import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import axios from "../lib/axios";

function useTokenFromLocalStorage(initialValue) {
  const [value, setValue] = useLocalStorage("token", initialValue);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    checkToken();
  }, [value]);

  async function checkToken() {
    const { data } = await axios.post("/check-token", { token: value });

    setIsValid(data.isValid);
  }
  return [value, setValue, isValid];
}

export default useTokenFromLocalStorage;
