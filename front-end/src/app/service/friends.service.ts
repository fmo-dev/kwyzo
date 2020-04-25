import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../model/user.model';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  $notifications = new BehaviorSubject<[]>(null);
  $friends = new BehaviorSubject<any[]>(null);
  $receivedDemands = new BehaviorSubject<User[]>(null);
  $sendDemands = new BehaviorSubject<User[]>(null)

  constructor(private userService: UserService,
    private socket: SocketService) {
    this.socket.$socketDestroy.subscribe(value => {
      if (value) {
        this.$friends.next(null);
        this.$receivedDemands.next(null);
        this.$sendDemands.next(null);
      }
    })
    this.socket.$newUser.subscribe((value) => { if (value) this.updateReceived() })
    this.socket.$friendsEvent.subscribe(data => { if (data) this.updateNotifications(data) })
  }


  updateNotifications(data) {
    if (data != null) {
      this.$notifications.next(data);
      switch (data.type) {
        case "request":
        case "deleteDemand":
          this.updateReceived();
          break;
        case "deleteRequest":
          this.updateDemands();
          break;
        case "deleteFriend":
          this.updateFriends();
          break;
        case "acceptRequest":
          this.updateFriends();
          this.updateDemands();
      }
    }
    else {
      this.updateFriends();
      this.updateDemands();
    }
  }

  updateFriends() {
    this.userService.getFriends()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.$friends.next(data);
      })

  }

  updateReceived() {
    this.userService.getFriendsReceived()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.$receivedDemands.next(data)
      })
  }

  updateDemands() {
    this.userService.getFriendsSend()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.$sendDemands.next(data)
      })
  }
}
