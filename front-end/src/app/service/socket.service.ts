import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth-utility/auth.service';
import { UserService } from './user.service';
import { User } from '../model/user.model';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  $userUpdate = new BehaviorSubject<any>(null);
  $newUser = new BehaviorSubject<boolean>(false);
  $friendsEvent = new BehaviorSubject<any>(null);
  $newScoreEvent = new BehaviorSubject<any>(null);
  $playableQuizzEvent = new BehaviorSubject<any>(null);
  $publicQuizzEvent = new BehaviorSubject<any>(null);
  $editableQuizzEvent = new BehaviorSubject<any>(null);
  $socketDestroy = new BehaviorSubject<boolean>(false);

  constructor(private userService: UserService, private auth: AuthService) {
    this.auth.$isAuth.subscribe(value => {
      if (value) this.$newUser.next(true)
      else if (!value && this.socket != undefined) this.disconnect()
    })
    this.userService.$currentUser.subscribe(data => {
      if (data) {
        data.update ? this.sendUserUpdate(data.user._id, data.user.userName) : this.connect(data.user._id)
      }
    })
  }

  connect(id) {
    console.log("Nouvelle Connexion")
    this.socket = io.connect("http://localhost:8080");
    this.socket.emit('addUser', id)
    this.socket.on('restart', () => {
      document.location.reload()
    })
    this.socket.on('getFriendNotif', data => {
      this.$friendsEvent.next(data);
      this.$playableQuizzEvent.next(false)
    })
    this.socket.on('getNewScore', data => {
      this.$editableQuizzEvent.next(data)
    })
    this.socket.on('getQuizzNotif', data => {
      this.$playableQuizzEvent.next(data)
    })
    this.socket.on('getQuizzUpdate', quiz => {
      this.$publicQuizzEvent.next(quiz)
    })
    this.socket.on('getUserUpdate', data => {
      this.$userUpdate.next(data);
    })
    this.socket.on('getSelfUpdate', () => {
      this.userService.getMe();
    })
    this.socket.on('newEdit', () => {
      this.$editableQuizzEvent.next(null)
    })
    this.socket.on('upFriends', () => {
      this.$friendsEvent.next(null)
    })
  };

  sendQuizzEndNotif(data) {
    this.socket.emit("quizzDone", data)
  }

  sendQuizzUpdate(quiz) {
    this.socket.emit("publicQuizzUpdate", quiz)
  }

  sendUserUpdate(id, userName) {
    this.socket.emit("userUpdate", {id, userName})
  }

  sendFriendNotif(data) {
    this.socket.emit("sendFriendNotif", data)
  }

  sendQuizNotif(data) {
    this.socket.emit("sendQuizNotif", data)
  }

  disconnect() {
    this.$socketDestroy.next(true);
    this.socket.emit("deconnexion")
    this.socket = undefined;
  }
}
