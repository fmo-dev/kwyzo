import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QuizzService } from './quizz.service';
import { SocketService } from './socket.service';
import { FriendsService } from './friends.service';
import { AuthService } from '../auth-utility/auth.service';
import { UserService } from './user.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlayableQuizzService {

  $playableQuizz = new BehaviorSubject<any[]>(null);
  $notifications = new BehaviorSubject<any[]>(null);

  constructor(private quizzService: QuizzService,
    private socket: SocketService,
    private friends: FriendsService) {
    this.socket.$socketDestroy.subscribe(value => { if (value) this.$playableQuizz.next(null) })
    this.socket.$playableQuizzEvent.subscribe(notification => { if (notification) this.update(notification) });
    this.friends.$friends.subscribe((data) => { if (data) this.update() })
  }

  update(notification = null, id = null) {
    if (notification) this.$notifications.next(notification)
    this.quizzService.getPlayableQuizz()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.$playableQuizz.next(data)
      })
  }
} 
