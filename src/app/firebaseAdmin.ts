// THIS CAN ONLY BE USED ON THE SERVER SIDE
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../nimble firebase-adminsdk.json";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
if (privateKey) {
  serviceAccount.private_key = privateKey;
} else {
  throw new Error("FIREBASE_PRIVATE_KEY is not defined");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});
