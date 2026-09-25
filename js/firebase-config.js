/* ============================================================
   FIREBASE CONFIG — fill this in with your own project's keys.
   README.md mein step-by-step bataya gaya hai ki yeh values
   Firebase console se kahan se milengi.
   ============================================================ */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Jab tak asli config nahi dala jata, yeh flag baaki JS files ko
// batata hai ki abhi setup baaki hai — taaki har jagah try/catch
// ke bajaye ek jagah se hi handle ho jaye.
const FIREBASE_NOT_CONFIGURED = firebaseConfig.apiKey === "YOUR_API_KEY";

let app, auth, db, storage;
if (!FIREBASE_NOT_CONFIGURED) {
  try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
  } catch (e) {
    console.error("Firebase init failed:", e);
  }
}
