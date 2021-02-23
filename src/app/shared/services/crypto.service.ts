import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private worker: Worker;

  private encryptSubject = new Subject<any>();
  private decryptSubject = new Subject<any>();

  constructor() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker('../workers/crypto.worker', { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        const {requestId, action, result} = data;
        if (action === 'encrypt') {
          this.encryptSubject.next({requestId, result});
        } else if (action === 'decrypt') {
          this.decryptSubject.next({requestId, result});
        }
      };
    } else {
      // Web Workers are not supported in this environment
      console.log('Web workers are not supported in your browser. Please use a modern and up to data web browser.');
    }
  }

  encrypt(content: string, password: string): Observable<string> {
    return new Observable<string>((observer: Subscriber<string>) => {
      const id = uuidv4();
      const message = { requestId: id, action: 'encrypt', content, password };
      const encrypt$ = this.encryptSubject.subscribe(({requestId, result}) => {
        // Message was response to different request
        if (requestId !== id) {
          return;
        }

        observer.next(result);
        observer.complete();

        encrypt$.unsubscribe();
      });

      this.worker.postMessage(message);
    });
  }

  decrypt(content: string, password: string): Observable<string> {
    return new Observable<string>((observer: Subscriber<string>) => {
      const id = uuidv4();
      const message = { requestId: id, action: 'decrypt', content, password };
      const decrypt$ = this.decryptSubject.subscribe(({requestId, result}) => {
        // Message was response to different request
        if (requestId !== id) {
          return;
        }

        decrypt$.unsubscribe();

        observer.next(result);
        observer.complete();
      });

      this.worker.postMessage(message);
    });
  }
}
