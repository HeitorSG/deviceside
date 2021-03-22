import { Component, OnInit } from '@angular/core';
import {SocketioService} from '../socketio.service';
import {LocalStorageService} from '../local-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  deviceName: string = "";
  ownerName: string = ""; 

  constructor(private socket:SocketioService, private router:Router, private storage:LocalStorageService) {}

  ngOnInit() {
    this.socket.setupSocketConnection();

  }

  syncDevice(){
    /*this.socket.syncDevice(this.deviceName, this.ownerName);
    this.socket.getSyncInfos().subscribe({
      next:(res) => {
        if(res != 0) {
          console.log(res);
          this.storage.set('device', res);*/
          this.router.navigate(['tab2']);
       /* }
      }
    })*/
  }
}
