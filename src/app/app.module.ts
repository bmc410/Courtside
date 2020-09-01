import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { TableModule } from 'primeng/table';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerpopoverPageModule } from './pages/playerpopover/playerpopover.module';
import { AuthenticateService } from './services/authenticate.service';
import { AuthguardService } from './services/authguard.service';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatchService } from './services/matchservice';
import { OfflineService } from './services/offline.service';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AppStateService } from './services/app-state-service.service';
import { AuthenticationService } from './services/authentication.service';
import { NetworkService } from './services/network.service';
import { AngularFireModule } from '@angular/fire';
import { MessageService } from 'primeng/api';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    MatInputModule,
    MatFormFieldModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    BrowserAnimationsModule,
    PlayerpopoverPageModule
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [AppComponent],
  providers: [InAppBrowser, SplashScreen, StatusBar,AuthenticateService,AuthguardService,
    MatchService, OfflineService, MessageService, AngularFirestore, AppStateService,AuthenticationService,NetworkService],
  bootstrap: [AppComponent]
})
export class AppModule {}
