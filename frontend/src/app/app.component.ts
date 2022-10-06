import { Component, Inject, OnInit } from '@angular/core';
import { NotifService } from './notif.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

export interface NotificationInfo {
  notId: number;
  userId: string;
  notificationName: string;
  status: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private notificationService: NotifService,
    public dialog: MatDialog
  ) {}
  // App title
  title: string = 'frontend';
  // Random course id -> it should be obtained from the DB
  id: number = Math.floor(Math.random() * 100);
  // Example of username -> it should be obtained from current user
  username: string = 'Gabi';
  // Array of updated notifications (marked as read)
  updatedNotifications: number[] = [];
  // Example of usr id -> it should be obtained from current user / login endpoint
  userId: string = '2';

  /**
   * Initial function: reads received messages
   */
  ngOnInit(): void {
    // Show all notifications
    this.notificationService.onNewMessage().subscribe(async (msg: any) => {
      // Array of notifications
      if (msg.notId === undefined) {
        for (const element of msg) {
          // One dialog per notification
          const result = await this.openDialog(element);
          // Result (notificatin id) is saved in an array when it is
          // marked as red
          if (result !== undefined) {
            this.updatedNotifications.push(element.notId);
          }
        }
      } else {
        // Only 1 notification
        const result = await this.openDialog(msg);
        // Result (notification id) is saved in an array when it is
        // marked as red
        if (result !== undefined) {
          this.updatedNotifications.push(msg.notId);
        }
      }
      // The array is sent to the back
      this.notificationService.sendMessage(
        'updateNotifications',
        this.updatedNotifications
      );
    });
  }

  /**
   * Opens dialogs for the notifications as Promise
   */
  openDialog(data: NotificationInfo): Promise<any> {
    const dialogRef = this.dialog.open(DialogDataExampleDialog, {
      data: data,
    });
    return dialogRef
      .afterClosed()
      .toPromise()
      .then((result) => {
        return Promise.resolve(result);
      });
  }

  /**
   * Obtains active (not read) user notifications
   */
  login(): void {
    this.dialog.closeAll();
    this.notificationService.sendMessage('userLogged', this.userId);
  }

  /**
   * Obtains registered notification
   */
  registerUser(): void {
    this.dialog.closeAll();
    this.notificationService.sendMessage('userRegistered', this.id);
  }
}

@Component({
  selector: 'app-dialog-data-example',
  templateUrl: './dialog/dialog-data-example.html',
})
export class DialogDataExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogDataExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationInfo
  ) {}

  /**
   * Closes dialog leaving the notification status in active
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Closes dialog leaving the notification status in ianctive
   * @param id notification id
   */
  updateNotificationState(id: number): void {
    this.dialogRef.close(id);
  }
}
