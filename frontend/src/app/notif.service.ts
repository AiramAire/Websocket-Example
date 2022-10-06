import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class NotifService {
  private socket: Socket;

  constructor() {
    this.socket = io('ws://localhost:3000');
  }

  // EMITTER example
  sendMessage(event: string, msg: string | number | number[]): void {
    this.socket.emit(event, msg);
  }

  // HANDLER example
  onNewMessage() {
    return new Observable((observer) => {
      this.socket.on('notifications', (msg: Object) => {
        observer.next(msg);
      });
    });
  }
}
