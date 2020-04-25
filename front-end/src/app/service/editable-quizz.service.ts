import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { SocketService } from './socket.service';
import { QuizzService } from './quizz.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EditableQuizzService {

  $editableQuizz = new BehaviorSubject<any[]>(null);
  $notifications = new BehaviorSubject<any>(null);
  constructor(private socket: SocketService,
    private quizzService: QuizzService,
    private user: UserService) {
    this.socket.$socketDestroy.subscribe(value => {if(value) this.$editableQuizz.next(null)})
    this.socket.$editableQuizzEvent.subscribe(notification => { if(notification) this.update(notification) })
  }

  update(notification = null) {
    if (notification) this.$notifications.next(notification);
      this.quizzService.getAllOfUser()
        .subscribe(({ data, error }) => {
          if (error) console.log("Erreur : ", error);
          this.$editableQuizz.next(data);
        })
  }
}
