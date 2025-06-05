import dotenv from "dotenv";
dotenv.config();

import twilio from "twilio";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse.js";

class Twilio {
  constructor() {
    this.client = new twilio(
      process.env.TWILIO_TOKEN_SID,
      process.env.TWILIO_TOKEN_SECRET,
      { accountSid: process.env.TWILIO_ACCOUNT_SID }
    );
  }

  getTwilioClient() {
    return this.client;
  }

  async sendVerify(to, channel) {
    const data = await this.client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to,
        channel,
      });

    return data;
  }

  async verifyCode(to, code) {
    const data = await this.client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to,
        code,
      });

    return data;
  }

  voiceResponse(message) {
    const twiml = new VoiceResponse();
    twiml.say(
      {
        voice: "female",
        loop: 2,
      },
      message
    );

    twiml.redirect("https://fa4c-37-57-168-221.ngrok-free.app/enqueue");

    return twiml;
  }

  enqueueCall(queueName) {
    const twiml = new VoiceResponse();

    twiml.enqueue(queueName);

    return twiml;
  }
}

const twilioInstance = new Twilio();
Object.freeze(twilioInstance);

export default twilioInstance;
