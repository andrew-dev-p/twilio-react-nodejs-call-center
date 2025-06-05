import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import bodyParser from "body-parser";
app.use(bodyParser.json());

import cors from "cors";
app.use(cors());

import twilio from "./twilio.js";
const twilioClient = twilio.getTwilioClient();

app.post("/login", async (req, res) => {
  const { to, username, channel } = req.body;
  const data = await twilio.sendVerify(to, channel);
  res.send(data);
});

app.get("/verify", async (req, res) => {
  const data = await twilio.verifyCode(process.env.MY_NUMBER, req.query.code);
  res.send(data);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
