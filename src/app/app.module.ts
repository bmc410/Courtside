import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, NavParams } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { TableModule } from 'primeng/table';
import {ToastModule} from 'primeng/toast';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule, FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerpopoverPageModule } from './pages/playerpopover/playerpopover.module';
import { AuthenticateService } from './services/authenticate.service';
import { AuthguardService } from './services/authguard.service';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatchService } from './services/matchservice';
import { OfflineService } from './services/offline.service';
//import { AngularFirestore } from 'angularfire2';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

//import { AngularFireStorageModule } from 'angularfire2/storage';
import { AppStateService } from './services/app-state-service.service';
import { AuthenticationService } from './services/authentication.service';
import { NetworkService } from './services/network.service';
//import { AngularFireModule } from 'angularfire2';
import { MessageService } from 'primeng/api';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ScoreboardPageModule } from './pages/scoreboard/scoreboard.module';
import { PlayerpickerPageModule } from './pages/playerpicker/playerpicker.module';
import { DexieService } from './services/dexie.service';
import { OfflineDatabase } from './models/dexie-models';
import {ConnectionServiceModule} from 'ng-connection-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    MatInputModule,
    ToastModule,
    ScoreboardPageModule,
    MatFormFieldModule,
    MatTableModule,
    MatDialogModule,
    MatSortModule,
    OverlayModule,
    IonicModule.forRoot({animated: false}),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    //AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule,
    PlayerpopoverPageModule,
    PlayerpickerPageModule,
    ConnectionServiceModule
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [MatDialog, InAppBrowser, SplashScreen, StatusBar,AuthenticateService,AuthguardService,NavParams,
    MatchService, OfflineService, OfflineDatabase, MessageService, DexieService,
    AppStateService,AuthenticationService,NetworkService],
  bootstrap: [AppComponent]
})
export class AppModule {}
