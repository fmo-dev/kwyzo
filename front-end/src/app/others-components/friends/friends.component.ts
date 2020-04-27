import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { SocketService } from '../../service/socket.service';
import { FriendsService } from '../../service/friends.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']

})
export class FriendsComponent implements OnInit, OnDestroy {

  friendSearchArray: User[] = [];
  demandSend: string[] = [];

  sendDemands: User[] = [];
  receivedDemands: User[] = [];
  allFriends: User[] = [];

  displayFind: boolean;
  displaySend: boolean;
  displayReceived: boolean;

  hoverCross: boolean;

  subscriber = new Subscription();


  constructor(private socket: SocketService,
    private friends: FriendsService,
    private userService: UserService) { }

  ngOnInit() {
    this.initPage()
    this.subscriber.add(this.friends.$receivedDemands.subscribe(value => {
      if(value) this.receivedDemands = value;
    }))
    this.subscriber.add(this.friends.$friends.subscribe(value => {
      if(value) this.allFriends = value
    }))
    this.subscriber.add(this.friends.$sendDemands.subscribe(value => {
      if(value) this.sendDemands = value
    }))

  }


  // GET DATA

  async initPage() {
      this.getFriends()
      this.getRequest();
      this.getDemands();
  }

  getDemands() {
    this.userService.getFriendsSend()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.sendDemands = data;
        console.log(data);
        
      })
  }

  getRequest() {
    this.userService.getFriendsReceived()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.receivedDemands = data;
      })
  }

  getFriends() {
    this.userService.getFriends()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.allFriends = data;
      })
  }



  // NAVIGATION

  onHoverCross() {
    this.hoverCross = true;
  }

  onLeaveCross() {
    this.hoverCross = false;
  }

  closeAll() {
    this.displayFind = false;
    this.displaySend = false;
    this.displayReceived = false;
  }





  // SEARCHING


  displaySendDemands() {
    if (!this.displaySend) setTimeout(() => this.displaySend = true, 0)
    else this.displaySend = false;
  }

  displayReceivedDemands() {
    if (!this.displayReceived) setTimeout(() => this.displayReceived = true, 0)
    else this.displayReceived = false;
  }

  searchFriend(searchBar) {
    if (searchBar.value.trim().length > 1) {
      this.friendSearchArray.length = 0;
      this.userService.getUsersByLetters(searchBar.value)
        .subscribe(({ data, error }) => {
          if (error) console.log("Error : ", error);
          else if (data) {
            this.friendSearchArray = data;
            data.length > 0 ? this.displayFind = true : this.displayFind = false;
          }
        })
    }
    else this.displayFind = false;
  }





  // ACTIONS


  sendFriendRequest(id, name) {
    this.userService.sendFriendRequest(id)
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.sendDemands.push(new User({_id : data.id, userName: data.receiver}))  
        console.log(this.sendDemands);
        
        this.socket.sendFriendNotif({
          id: data.id,
          type: "request",
          message: "Vous avez reçu une demande d'ami de la part de " + data.sender,
          route: '/amis'
        });
      });
    this.updateDemands(name);
  }

  updateDemands(name) {
      const value = "Demande envoyée à " + name;
      const index = this.demandSend.length;
      this.demandSend.push(value);
      setTimeout(() => {
        for (let i = 0; i < this.demandSend.length; i++) {
          if (this.demandSend[i] == value) {
            this.demandSend.splice(i, 1);
            break;
          }
        }
      }, 3000)
    }

  deleteDemand(id) {
    this.userService.deleteDemand(id)
      .subscribe(({ data, error }) => {
        if (error) console.log('Error : ', error);
        this.socket.sendFriendNotif({
          id: data.id,
          type: "deleteDemand",
          message: data.sender + " a supprimé sa demande d'ami",
          route: '/amis'
        });
        this.getDemands();
      })
  }

  deleteRequest(id) {
    this.userService.deleteRequest(id)
      .subscribe(({ data, error }) => {
        if (error) console.log('Error : ', error);
        this.socket.sendFriendNotif({
          id: data.id,
          type: "deleteRequest",
          message: data.sender + " a refusé votre demande d'ami",
          route: '/amis'
        });
        this.friends.updateReceived()
      })
    setTimeout(() => this.hoverCross = false, 0)
  }

  acceptRequest(id) {
    this.userService.acceptRequest(id)
      .subscribe(({ data, error }) => {
        if (error) console.log('Error : ', error);
        this.socket.sendFriendNotif({
          id: data.id,
          type: "acceptRequest",
          message: data.sender + " a accepté votre demande d'ami",
          route: '/amis'
        });
        this.friends.updateReceived();
        this.friends.updateFriends()
      })
  }

  deleteFriend(id) {
    this.userService.deleteFriend(id)
      .subscribe(({ data, error }) => {
        if (error) console.log('Error : ', error);
        this.socket.sendFriendNotif({
          id: data.id,
          type: "deleteFriend",
          message: data.sender + " vous a supprimé de ses amis",
          route: '/amis'
        });
        this.friends.updateFriends()
      })
  }


  // UNSUBSCRIBER

  ngOnDestroy() {
    this.subscriber.unsubscribe()
  }



}
