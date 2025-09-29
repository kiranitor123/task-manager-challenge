import {initializeApp, getApps, App} from "firebase-admin/app";
import {getFirestore, Firestore, Timestamp} from "firebase-admin/firestore";
import {LoggerPort} from "../../../application/ports/out/logger.port";

export class FirestoreAdapter {
  private readonly db: Firestore;

  constructor(private readonly logger: LoggerPort) {
    // Initialize Firebase Admin if not already initialized
    let app: App;
    if (!getApps().length) {
      app = initializeApp();
      this.logger.info("Firebase Admin initialized");
    } else {
      app = getApps()[0];
    }

    this.db = getFirestore(app);
    this.db.settings({
      ignoreUndefinedProperties: true,
    });
  }

  getCollection(name: string) {
    return this.db.collection(name);
  }

  convertTimestamp(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }
    return timestamp;
  }

  convertToTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }
}
