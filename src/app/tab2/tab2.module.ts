import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import {WebcamModule} from 'ngx-webcam';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    WebcamModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
