import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizzService } from '../../../service/quizz.service';
import { Quizz } from '../../../model/quizz.model';
import { PlayableQuizzService } from '../../../service/playable-quizz.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth-utility/auth.service';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-play-choice',
  templateUrl: './play-choice.component.html',
  styleUrls: ['./play-choice.component.scss']
})
export class PlayChoiceComponent implements OnInit, OnDestroy {

  quizz: any[] = [];
  subscriber = new Subscription();
  constructor(private playableQuizz: PlayableQuizzService,
    private quizzService: QuizzService,
    private socket: SocketService) { }

  ngOnInit() {
    this.getQuizz();
    this.subscriber
      .add(this.playableQuizz.$playableQuizz.subscribe(quizz => {
        if (quizz) this.quizz = quizz;
      }))
      .add(this.socket.$userUpdate.subscribe(user => {
        if (user) {
          this.quizz = this.quizz.map(quiz => {
            if (quiz.createBy._id == user.id) {
              quiz.createBy.userName = user.userName;
              return quiz
            }
          })  
        }
      }))
      .add(this.socket.$publicQuizzEvent.subscribe(quiz => {
        if (quiz) {
          if (!quiz.isPublic) {
            for (let i = 0; i < this.quizz.length; i++) {
              if (this.quizz[i]._id == quiz._id) {
                if (!this.quizz[i].ofFriend) this.quizz.splice(i, 1);
                break;
              }
            }
          }
          else this.quizz.push({ ...quiz, ofFriend: false })
        }
      }))

  }

  getQuizz() {
    this.quizzService.getPlayableQuizz()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.quizz = data
      })
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe()
  }
}
