const functions = require("firebase-functions");
const admin = require("firebase-admin");

const app = require("express")();

admin.initializeApp();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "socialape-f5389.firebaseapp.com",
  projectId: "socialape-f5389",
  storageBucket: "socialape-f5389.appspot.com",
  messagingSenderId: "317069310239",
  appId: "1:317069310239:web:c404d321fe78fdd4bd182a",
};

const { initializeApp } = require("firebase/app");
const fireApp = initializeApp(firebaseConfig);

const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

// function to get documents(screams)
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

// function for creating documents(screams)
app.post("/scream", (req, res) => {
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

// Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  // Todo Validate data

  const auth = getAuth();
  createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res
        .status(201) // Resource created
        .json({ message: `user ${data.user.uid} signed up successfully` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);

// to avoid latency abt 300ms on production
// exports.api = functions.region('europe-west1').https.onRequest(app);
