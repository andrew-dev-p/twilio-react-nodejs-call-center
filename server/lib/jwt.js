import jwt from "jsonwebtoken";

const SECRETE_KEY = process.env.JWT_SECRET;

const createJwt = (username) => {
  const token = jwt.sign({ username }, SECRETE_KEY);
  return token;
};

const verifyToken = (token) => {
  const data = jwt.verify(token, SECRETE_KEY);
  return data;
};

export { createJwt, verifyToken };
