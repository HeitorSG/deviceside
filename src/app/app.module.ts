import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {WebcamModule} from 'ngx-webcam';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {LocalStorageService} from './local-storage.service';

import {SocketIoModule,SocketIoConfig} from 'ngx-socket-io';
const socketconfig: SocketIoConfig = {url:'http://localhost:3000', options:{ rememberUpgrade:true,
transports: ['websocket'],
secure:true, 
rejectUnauthorized: false}}




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, WebcamModule,IonicModule.forRoot(), AppRoutingModule,  SocketIoModule.forRoot(socketconfig)],
  providers: [
    LocalStorageService,
    StatusBar,
    Geolocation,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
