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
app.use(bodyParser.urlencoded({ extended: false }));
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

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", async (req, res) => {
  const { to, username, channel } = req.body;
  const data = await twilio.sendVerify(to, channel);
  res.send(data);
});

app.post("/verify", async (req, res) => {
  const { to, code, username } = req.body;

  let data;
  try {
    data = await twilio.verifyCode(to, code);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Twilio verification failed" });
  }

  if (!data) {
    return res.status(500).send({ error: "No response from Twilio" });
  }

  if (data.status === "approved") {
    const token = createJwt(username);
    res.send({ token });
  } else {
    res.status(401).send({ error: "Invalid code" });
  }
});

app.post("/call-new", async (req, res) => {
  io.emit("call-new", { data: req.body });

  const response = twilio.voiceResponse("Thank you for calling!");

  res.type("text/xml");
  res.send(response.toString());
});

app.post("/call-status-change", async (req, res) => {
  console.log("call-status-change");
  res.send("call-status-change");
});
