import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  isDevMode,
} from '@angular/core';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';

const firebaseConfig = {
  apiKey: "AIzaSyDAI_5UAfV6BRvYsZPfnrdczqKDMg6tJiY",
  authDomain: "ecoclassroom-ee719.firebaseapp.com",
  projectId: "ecoclassroom-ee719",
  storageBucket: "ecoclassroom-ee719.appspot.com",
  messagingSenderId: "103539621887",
  appId: "1:103539621887:web:1d97843ecd39cfa5f871ca",
  measurementId: "G-5VMZYFY0K5"
};

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true}),
    provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp(firebaseConfig)
    ),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'mk', 'al'],
        defaultLang: 'mk',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
