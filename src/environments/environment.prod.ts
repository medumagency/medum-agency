export const environment = {
  production: true,
  googleApiKey: process.env.GOOGLE_API_KEY,
  firebase: {
    apiKey: process.env.FIREBASE_APP_KEY,
    authDomain: process.env.FIREBASE_AUTH,
    databaseURL: process.env.FIREBASE_DB,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_BUCKET,
    messagingSenderId: process.env.FIREBASE_SENDER_ID
  },
  sendEmail: process.env.SEND_EMAIL_URL
};
