import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';

@Injectable()
export class ChatService {
  private url = 'http://localhost:4300';  
  private socket;

  constructor() {this.socket = io(this.url);}
  
  sendMessage(message){
    let observable = new Observable(observer => {
        this.socket = io(this.url);
        this.socket.on('message', (data) => {
          observer.next(data);    
        });
        return () => {
          this.socket.disconnect();
        };  
    });

    observable.subscribe((message) => {alert("THIS WAS THE MESSAGE: " + message);})
    this.socket.emit('message', message);    
  }
  
//   getMessages() {
//     let observable = new Observable(observer => {
//       this.socket = io(this.url);
//       this.socket.on('message', (data) => {
//         observer.next(data);    
//       });
//       return () => {
//         this.socket.disconnect();
//       };  
//     })     
//     return observable;
//   }  
}