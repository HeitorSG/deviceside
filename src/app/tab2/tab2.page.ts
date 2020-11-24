import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Geolocation, Geoposition, GeolocationOptions} from '@ionic-native/geolocation/ngx';
import {SocketioService} from '../socketio.service';
import {LocalStorageService} from '../local-storage.service';
import * as faceapi from 'face-api.js';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit,AfterViewInit{
  @ViewChild('test') myvideo;
  @ViewChild('bd') body:ElementRef;
  

  constructor(private geolocation:Geolocation, private socket:SocketioService, private storage:LocalStorageService) {
  }

  ngAfterViewInit(){
      console.log(this.myvideo.canvas);
      this.myvideo.video.nativeElement.addEventListener('playing', () => {
      console.log('funciona');
      const canvas = this.myvideo.canvas.nativeElement
      this.body.nativeElement.append(canvas);
      const displaySize = {width: this.myvideo.video.nativeElement.width, height: this.myvideo.video.nativeElement.height};
      faceapi.matchDimensions(canvas, displaySize);
      setInterval(async () => {
        const dtc = await faceapi.detectAllFaces(this.myvideo.video.nativeElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        const resizedDtc = faceapi.resizeResults(dtc, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDtc);
      }, 100);
    });
  }

  ngOnInit(){
   /*const options: GeolocationOptions = {
      timeout:100,
      enableHighAccuracy:true
    }
    let watch = this.geolocation.watchPosition(options);
    watch.subscribe((data:Geoposition) => {
      console.log(data.coords);
      this.socket.sendCoords(data.coords);
    },
    (data:PositionError) =>{
      console.log("err",data);
    }
    );*/
  

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models')
    ]);
    this.getPosition();
  }

  
  getPosition(){
    console.log('entrou');
    setInterval(() => {
      this.geolocation.getCurrentPosition().then((resCoord) => {
        this.storage.get('device').subscribe({
          next:(res) => {
            if(res != 0) {
              this.socket.sendCoords([resCoord.coords.longitude, resCoord.coords.latitude], res.name, res.ownerid);
            }
          }
        })
      });
    }, 5000);
  }

}
