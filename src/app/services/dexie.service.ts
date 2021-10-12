import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {
  constructor() {
    super('CourtsideDB');
    this.version(1).stores({
      players: 'id,mag,time'
    });
  }
}

