import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class FileHandlerService {
  private basePath = '';
  constructor(private storage: AngularFireStorage) { }

 
}
