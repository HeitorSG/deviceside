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
import {NgxAgoraModule} from 'ngx-agora';


import {SocketIoModule,SocketIoConfig} from 'ngx-socket-io';
const socketconfig: SocketIoConfig = {url:'https://tccserver.loca.lt', options:{ rememberUpgrade:true,
transports: ['websocket'],
secure:true, 
rejectUnauthorized: false}}
const agoraConfig = {
  AppID: 'af7cf4e1dc8e4c1597497b3bbcead4c0'
}




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, WebcamModule,IonicModule.forRoot(), AppRoutingModule, NgxAgoraModule.forRoot(agoraConfig), SocketIoModule.forRoot(socketconfig)],
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
