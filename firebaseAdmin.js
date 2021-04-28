const admin = require("firebase-admin");
const serviceAccount = require("./homework-reminder-cdba8-firebase-adminsdk-d6te6-c2b550917e.json");
// add your firebase db url here
const FIREBASE_DATABASE_URL = 'firebase-adminsdk-d6te6@homework-reminder-cdba8.iam.gserviceaccount.com';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DATABASE_URL
});
const firebaseAdmin = {};
firebaseAdmin.sendMulticastNotification = function(payload) {
    const message = {
        notification: {
            title: payload.title,
            body: payload.body
        },
        tokens: payload.tokens,
        data: payload.data || {}
    };
    return admin.messaging().sendMulticast(message);
};
module.exports = firebaseAdmin;