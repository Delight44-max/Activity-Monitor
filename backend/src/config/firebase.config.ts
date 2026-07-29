import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseConfig implements OnModuleInit {
    constructor(
        private configService: ConfigService,
    ) {}

    onModuleInit() {
        try {
            const projectId =
                this.configService.get<string>('FIREBASE_PROJECT_ID');

            const clientEmail =
                this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

            const privateKey =
                this.configService
                    .get<string>('FIREBASE_PRIVATE_KEY')
                    ?.replace(/\\n/g, '\n');


            if (!projectId || !clientEmail || !privateKey) {
                throw new Error(
                    'Missing Firebase Admin environment variables. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY',
                );
            }


            // Prevent duplicate initialization
            if (admin.apps.length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey,
                    }),
                });
            }


            console.log('✅ Firebase initialized successfully');

        } catch (error) {
            console.error(
                '❌ Firebase initialization failed:',
                error.message,
            );

            throw error;
        }
    }


    getAdmin() {
        return admin;
    }
}



@Injectable()
export class FirebaseService {
    constructor(
        private firebaseConfig: FirebaseConfig,
    ) {}


    async verifyIdToken(idToken: string) {
        return await this.firebaseConfig
            .getAdmin()
            .auth()
            .verifyIdToken(idToken);
    }


    async getUser(uid: string) {
        return await this.firebaseConfig
            .getAdmin()
            .auth()
            .getUser(uid);
    }


    async createUser(
        uid: string,
        email: string,
        displayName?: string,
    ) {
        return await this.firebaseConfig
            .getAdmin()
            .auth()
            .createUser({
                uid,
                email,
                displayName: displayName || undefined,
            });
    }
}