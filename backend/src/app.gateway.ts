import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { SavedData } from './data/savedData';
import { NotificationInfo } from './data/savedData.class';

@WebSocketGateway({ cors: true })
export class AppGateway {
  constructor(private saveNotifications: SavedData) {}

  @WebSocketServer() server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('userLogged')
  public async userlogged(_event: any, userId: string): Promise<void> {
    this.server.emit(
      'notifications',
      this.saveNotifications.notifications.filter(
        (x: any) => x.status === 'new' && x.userId === userId,
      ),
    );
  }

  @SubscribeMessage('userRegistered')
  public async userRegistered(_event: any, course: number): Promise<void> {
    const notification: NotificationInfo = {
      notId: this.saveNotifications.notifications.length + 1,
      userId: '2',
      notificationName: 'You have been registered in course: ' + course,
      status: 'new',
    };
    this.saveNotifications.notifications.push(notification);
    this.server.emit('notifications', notification);
  }

  @SubscribeMessage('updateNotifications')
  public async updateNotifications(
    _event: any,
    notifications: number[],
  ): Promise<void> {
    for (let elementId of notifications) {
      this.saveNotifications.notifications[elementId - 1].status = 'read';
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client}`);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client}`);
  }
}
