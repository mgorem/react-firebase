const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const app = express();

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

// function for getting documents(screams)
exports.getScreams = functions.https.onRequest((req, res) => {});

// function for creating documents(screams)
app.post("/scream", (req, res) => {
  // if (req.method !== "POST") {
  //   res.status(400).json({ error: `Method not allowed` }); // error from client
  // }
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(), // or admin.firestore.Timestamp.fromDate(new Date()),
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document $[doc.id] created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: `Something went wrong` }); // error from server
      console.error(err);
    });
});

// https://baseurl.com/api/

exports.api = functions.https.onRequest(app);

// to avoid latency abt 300ms on production
// exports.api = functions.region('europe-west1').https.onRequest(app);
