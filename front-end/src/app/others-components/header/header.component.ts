import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth-utility/auth.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { UserService } from '../../service/user.service';
import { SocketService } from '../../service/socket.service';
import { DisplayMenuService } from '../../service/display-menu.service';
import { Router, NavigationStart } from '@angular/router';
import { FriendsService } from '../../service/friends.service';
import { User } from '../../model/user.model';
import { PlayableQuizzService } from '../../service/playable-quizz.service';
import { EditableQuizzService } from '../../service/editable-quizz.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  displayMenu: boolean;
  notifications: any[] = []
  receivedDemands: User[] = [];
  subscriber = new Subscription();
  userName : string;

  ngOnInit() {
    this.subscriber.add(this.user.$currentUser.subscribe(value => { if(value) this.userName = value.user.userName }))
    this.subscriber.add(this.friends.$receivedDemands.subscribe(value => { if(value) this.receivedDemands = value }))
    this.subscriber.add(this.displayService.$menuDisplay.subscribe(value => this.displayMenu = value))
    this.subscriber.add(this.friends.$notifications.subscribe((value: any) => this.updateNotification(value)))
    this.subscriber.add(this.editableQuizz.$notifications.subscribe((value: any) => this.updateNotification(value)))
    this.subscriber.add(this.playableQuiz.$notifications.subscribe((value: any) => this.updateNotification(value)))
  }

  constructor(private user: UserService,
    private friends: FriendsService,
    private displayService: DisplayMenuService,
    private editableQuizz: EditableQuizzService,
    private playableQuiz: PlayableQuizzService,
    private router: Router) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationStart) this.displayMenu = false
    })
  }

  updateNotification(value) {
    if (value != null && value.type != null) {
      const index = this.notifications.length;
      this.notifications.push(value);
      setTimeout(() => {
        for (let i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i] == value) {
            this.notifications.splice(i, 1);
            break;
          }
        }
      }, 5000)
    }
  }

  setDisplay() {
    this.displayMenu = !this.displayMenu;
  }

  unLog() {
    this.user.logout();
  }

  onNotifClick(i) {
    this.notifications.splice(i, 1);
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe()
  }
}
