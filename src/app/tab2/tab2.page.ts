import { Component, OnInit } from '@angular/core';
import {Geolocation, Geoposition} from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  constructor(private geolocation:Geolocation) {}

  ngOnInit(){
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data:Geoposition) => {
      console.log(data.coords);
    },
    (data:PositionError) =>{
      console.log("err",data);
    }
    );
  }
}
