import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import twilio from "./twilio.js";
const twilioClient = twilio.getTwilioClient();

app.get("/login", async (req, res) => {
  const data = await twilio.sendVerify(process.env.MY_NUMBER, "sms");
  res.send(data);
});

app.get("/verify", async (req, res) => {
  const data = await twilio.verifyCode(process.env.MY_NUMBER, req.query.code);
  res.send(data);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
