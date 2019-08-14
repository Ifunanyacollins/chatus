// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");
const moment = require("moment");
const cors = require("cors")({ origin: true });

// The Firebase Admin SDK to access the Firebase Realtime Database.
// const admin = require('firebase-admin');
// admin.initializeApp();

const OpenTok = require("opentok"),
  opentok = new OpenTok(apiKey, secretKey);

exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    let token = "";
    //Generate session and inside the callback Generate token
    opentok.createSession(
      { mediaMode: "routed", archiveMode: "always" },
      function(err, session) {
        if (err) return console.log(err);
        const date = moment().set("hour", 13);
        // Generate token
        token = session.generateToken({
          role: "moderator",
          expireTime: date,
          data: "name=collins",
          initialLayoutClassList: ["focus"]
        });

        // save the sessionId
        response.send({
          sessionId: session.sessionId,
          apiKey: "put_your_api_key",
          token
        });
      }
    );
  });
});
