require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/token', (req, res) => {
  const identity = req.body.identity || 'user';
  
  const token = new twilio.jwt.AccessToken(
    accountSid,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity: identity }
  );

  token.addGrant(new twilio.jwt.AccessToken.VoiceGrant({
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: true
  }));

  res.send({
    token: token.toJwt()
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});