"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// Test Cloud Function to verify server-side builds are active
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send('Rhymance Cloud Backend Active');
});
//# sourceMappingURL=index.js.map