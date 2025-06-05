import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import twilio from "./twilio.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const twilioClient = twilio.getTwilioClient();
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const socketio = new Server(server);

socketio.on("connection", (socket) => {
  console.log("New client connected");
});

socketio.on("disconnect", (socket) => {
  console.log("Client disconnected");
});

app.post("/login", async (req, res) => {
  const { to, username, channel } = req.body;
  const data = await twilio.sendVerify(to, channel);
  res.send(data);
});

app.post("/verify", async (req, res) => {
  const { to, code } = req.body;
  const data = await twilio.verifyCode(to, code);
  console.log(data);
  res.send(data);
});
