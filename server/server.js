import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import twilio from "./twilio.js";
import { createJwt } from "./lib/jwt.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const twilioClient = twilio.getTwilioClient();
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
});

io.on("disconnect", (socket) => {
  console.log("Client disconnected");
});

app.post("/login", async (req, res) => {
  const { to, username, channel } = req.body;
  const data = await twilio.sendVerify(to, channel);
  res.send(data);
});

app.post("/verify", async (req, res) => {
  const { to, code, username } = req.body;
  const data = await twilio.verifyCode(to, code);

  if (data.status === "approved") {
    const token = createJwt(username);
    res.send({ token });
  } else {
    res.status(401).send({ error: "Invalid code" });
  }
});
