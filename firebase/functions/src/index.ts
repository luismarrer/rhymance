import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Test Cloud Function to verify server-side builds are active
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Rhymance Cloud Backend Active');
});
