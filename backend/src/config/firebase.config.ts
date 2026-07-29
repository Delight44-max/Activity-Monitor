import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseConfig implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const credentialsFile = this.configService.get<string>('FIREBASE_CREDENTIALS_FILE');
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      
      if (!credentialsFile) {
        throw new Error('FIREBASE_CREDENTIALS_FILE is not defined in environment variables');
      }

      const serviceAccountPath = path.join(process.cwd(), credentialsFile);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        projectId: projectId || undefined,
      });

      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error.message);
      throw error;
    }
  }

  getAdmin() {
    return admin;
  }
}

@Injectable()
export class FirebaseService {
  constructor(private firebaseConfig: FirebaseConfig) {}

  async verifyIdToken(idToken: string) {
    return await this.firebaseConfig.getAdmin().auth().verifyIdToken(idToken);
  }

  async getUser(uid: string) {
    return await this.firebaseConfig.getAdmin().auth().getUser(uid);
  }

  async createUser(uid: string, email: string, displayName?: string) {
    return await this.firebaseConfig.getAdmin().auth().createUser({
      uid,
      email,
      displayName: displayName || undefined,
    });
  }
}