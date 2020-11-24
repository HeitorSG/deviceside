import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(public storage:StorageMap) { }

  set(index, data) {
    console.log(data);
    this.storage.set(index, data).subscribe(() => {
      
    });
  }

  get(index): Observable<any> {
    const result: BehaviorSubject<any> = new BehaviorSubject<any>(0);
    this.storage.get(index).subscribe((getData) => {
      console.log(getData);
      
      //this.socket.mapInit(getData);
      result.next(getData);
      result.complete();
    });
    return result.asObservable();
  }

  clear() {
    this.storage.clear().subscribe(() => {

    });
  }

  delete(index) {
    this.storage.delete(index).subscribe(() => {});
  }

}
