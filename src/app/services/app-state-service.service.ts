import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private isMobile: boolean;
  private _showTabs: boolean;
  private subject = new Subject<any>();

  //private dataSource = new BehaviorSubject<boolean>(false);
  //data: Observable<any>;

  private dataSource = new BehaviorSubject<boolean>(false);
  data = this.dataSource.asObservable();

  onOrientationChange(): Observable<any> {
      return this.subject.asObservable();
  }

  constructor() { 
    //this.data = this.dataSource.asObservable();
    if (window.innerWidth <= 768) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }

    // if (window.innerHeight <= 768) {
    //   //this._showTabs = false
    //   this.dataSource.next(false);
    // } else {
    //   this.dataSource.next(true);
    //   //this._showTabs = true
    // }

  }

  public getIsMobile() : boolean {
    return this.isMobile
  }

  public showTabs() : boolean {
    return this._showTabs
  }

  public setTabs(v: boolean) {
    this.dataSource.next(v);
  }


}
