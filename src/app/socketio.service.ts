import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  constructor(private socket:Socket) { 

  }

  setupSocketConnection(){
    this.socket.on('connection', socket =>{
      console.log(socket.id);
    });
  }

  syncDevice(deviceName, ownerName) {
    console.log(deviceName, ownerName);
    this.socket.emit('sync_device', {
      Name: deviceName,
      ownerName: ownerName
    });
  }

  getSyncInfos():Observable<any> {
    const result: BehaviorSubject<any> = new BehaviorSubject<any>(0);
    this.socket.on('sync_return', (data) => {
      console.log(data);
      result.next(data);
      result.complete();
    });
    return result.asObservable();
  }

  sendCoords(coords, deviceName, OwnerID) {
    console.log(coords);
    this.socket.emit('send_coords',{
      Name: deviceName,
      OwnerID: OwnerID,
      coords: coords
    });
  }
}
