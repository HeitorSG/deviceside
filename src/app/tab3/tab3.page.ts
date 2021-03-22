import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {NgxAgoraService, Stream, AgoraClient, ClientEvent, StreamEvent} from 'ngx-agora';
import { LocalStorageService } from '../local-storage.service';
import { inject } from '@angular/core/testing';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit,AfterViewInit {
  @ViewChild('vctrl') myview: ElementRef;
  @ViewChild('actrl') aview: ElementRef;
  remoteCalls: string[] = [];
  localCallId = 'agora_local';
  icon: string = "<div style='height:50px; width:50px;'><ion-icon name='videocam-outline' id='videoon' style='height:100%; width:100%;color:#17a2b8;'></ion-icon></div>";
  icona: string = "<div style='height:50px; width:50px;'><ion-icon name='mic-outline' id='audioon' style='height:100%; width:100%;color:#17a2b8;'></ion-icon></div>";
  private client: AgoraClient;
  private localStream: Stream;
  private uid:number;
  constructor(private ngxAgoraService:NgxAgoraService, private storage: LocalStorageService, private router:Router) {
    this.uid = Math.floor(Math.random() * 100);
   }

   ngAfterViewInit(){
    //gets the html element of both the camera and microphone buttons
    this.aview.nativeElement.innerHTML = this.icona;
    this.myview.nativeElement.innerHTML = this.icon;
   
   }

  ngOnInit() {
    //creeate your stream and joins a channel(the first argument passed to the join function is the token of the channel you are joining)
    this.client = this.ngxAgoraService.createClient({mode:'rtc', codec:'h264'});
    this.assignClientHandler();
    this.localStream = this.ngxAgoraService.createStream({streamID: this.uid, audio:true, video:true, screen: false});
    this.assignLocalStreamHandlers();
    this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
  }

  join(onSuccess?: (uid:number | string) => void, onFailure?: (error:Error) => void){
    
      this.client.join('006af7cf4e1dc8e4c1597497b3bbcead4c0IADCCyLoPU8dCqjjymO0CqztPB2kDj/k05A+1sCD+7YXFOnZLEwAAAAAEAA1BQ7XltzPXwEAAQCX3M9f','foo-bar', this.uid, onSuccess, onFailure);
    
   
  }

  publish(){
    //publish your stream to agora servers making it available to others in that channel
    this.client.publish(this.localStream, err => console.log('publish local stream error:', err));
  }

  private assignLocalStreamHandlers(){
    //listeners for you local stream handles mainly the camera and microphone permissions
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('access allowed');
    });

    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log('access denied');
    });

  }

  private initLocalStream(onSuccess?: () => any){
    //create the local streams displaying the video and the audio
    this.localStream.init(
      () => {
        this.localStream.play(this.localCallId,{fit:'contain'});
        if(onSuccess) {
          onSuccess();
        }
      },
      err => console.error('getusermedia failed', err)
    );
  }

  private assignClientHandler(){
    //listeners for the events coming from the clients connected to the same room
    this.client.on(ClientEvent.LocalStreamPublished, evt => {
      console.log('publish local stream successfully');
    });

    this.client.on(ClientEvent.Error, error => {
      console.log('Error Msg:', error.reason);
      if(error.reason === 'DYNAMIC_KEY_TIMEOUT'){
        this.client.renewChannelKey(
          '',
          () => console.log('renewed the channel key successfully'),
          renewError => console.error('renew channel key failed:', renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, evt => {
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, {audio: true, video:true}, err => {
        console.log('sub stream failed');
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      if(!this.remoteCalls.length){
        this.remoteCalls.push(id);
        setTimeout(() => stream.play(id,{fit:'contain'}), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
      const stream = evt.stream as Stream;
      if(stream){
        stream.stop();
        this.remoteCalls = [];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, evt => {
      const stream = evt.stream as Stream;
      if(stream){
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !==  `${this.getRemoteId(stream)}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });

  }

  private getRemoteId(stream: Stream): string {
  //get the agora id of the respective stream
    return `agora_remote-${stream.getId()}`;
  }

  private ctrlVideo(){
    //controls your camera turning on or off the video(linked with a html button with a camera icon)
    if(this.myview.nativeElement.innerHTML.indexOf('videoon') != -1){
      this.myview.nativeElement.innerHTML = "<div style='height:50px; width:50px;'><ion-icon name='videocam-off-outline' id='videooff' style='height:100%; width:100%;color:#17a2b8;'></ion-icon></div>"
      this.localStream.muteVideo();
    }
    else if(this.myview.nativeElement.innerHTML.indexOf('videooff') != -1){
      this.myview.nativeElement.innerHTML = "<div style='height:50px; width:50px;'><ion-icon name='videocam-outline' id='videoon' style='height:100%; width:100%;color:#17a2b8;'></ion-icon></div>"
      this.localStream.unmuteVideo();
    }
    
  }

  private ctrlAudio(){
    //controls your microphone turning on or off the audio(linked with a html button with a microphone icon)
    if(this.aview.nativeElement.innerHTML.indexOf('audioon') != -1){
      this.aview.nativeElement.innerHTML = "<div style='height:50px; width:50px;'><ion-icon name='mic-off-outline' id='audiooff' style='height:100%; width:100%;color:#17a2b8;'></ion-icon></div>";
      this.localStream.muteAudio();
    }
    else if(this.aview.nativeElement.innerHTML.indexOf('audiooff') != -1){
      this.aview.nativeElement.innerHTML = "<div style='height:50px; width:50px;'><ion-icon name='mic-outline' id='audioon' style='height:100%; width:100%;color:#17a2b8;'></ion-icon></div>";
      this.localStream.unmuteAudio();
    }
    
  }

 

}

