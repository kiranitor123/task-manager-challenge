import {User} from "../../../domain/entities/user.entity";
import {Email} from "../../../domain/value-objects/email.vo";
import {UserId} from "../../../domain/value-objects/user-id.vo";
import {UserRepositoryPort} from "../../../application/ports/out/user.repository.port";
import {LoggerPort} from "../../../application/ports/out/logger.port";
import {FirestoreAdapter} from "./firestore.adapter";

interface UserDocument {
  id: string;
  email: string;
  createdAt: FirebaseFirestore.Timestamp;
}

export class UserRepository implements UserRepositoryPort {
  private readonly collection = "users";

  constructor(
    private readonly firestore: FirestoreAdapter,
    private readonly logger: LoggerPort
  ) { }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const snapshot = await this.firestore
        .getCollection(this.collection)
        .where("email", "==", email.value)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return this.mapDocumentToEntity(doc.id, doc.data() as UserDocument);
    } catch (error: any) {
      if (error.code === 5 || error.message?.includes("NOT_FOUND")) {
        this.logger.info("User not found in database", {email: email.value});
        return null;
      }

      this.logger.error("Failed to find user by email", error as Error, {
        email: email.value,
      });
      throw error;
    }
  }

  async findById(id: UserId): Promise<User | null> {
    try {
      const doc = await this.firestore
        .getCollection(this.collection)
        .doc(id.value)
        .get();

      if (!doc.exists) {
        return null;
      }

      return this.mapDocumentToEntity(doc.id, doc.data() as UserDocument);
    } catch (error) {
      this.logger.error("Failed to find user by ID", error as Error, {
        userId: id.value,
      });
      throw new Error(`Repository error: ${error}`);
    }
  }

  async save(user: User): Promise<User> {
    try {
      const userData = {
        email: user.email.value,
        createdAt: this.firestore.convertToTimestamp(user.createdAt),
      };

      const docRef = await this.firestore
        .getCollection(this.collection)
        .add(userData);

      this.logger.info("User saved to repository", {
        userId: docRef.id,
        email: user.email.value,
      });

      return new User(
        UserId.fromString(docRef.id),
        user.email,
        user.createdAt
      );
    } catch (error) {
      this.logger.error("Failed to save user", error as Error, {
        email: user.email.value,
      });
      throw new Error(`Repository error: ${error}`);
    }
  }
  async exists(email: Email): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      this.logger.error("Failed to check if user exists", error as Error, {
        email: email.value,
      });
      throw new Error(`Repository error: ${error}`);
    }
  }

  private mapDocumentToEntity(id: string, doc: UserDocument): User {
    return new User(
      UserId.fromString(id),
      Email.create(doc.email),
      this.firestore.convertTimestamp(doc.createdAt)
    );
  }
}
