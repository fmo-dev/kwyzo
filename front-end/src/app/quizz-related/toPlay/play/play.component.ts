import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizzService } from '../../../service/quizz.service';
import { Quizz } from '../../../model/quizz.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SocketService } from '../../../service/socket.service';
import { PlayableQuizzService } from '../../../service/playable-quizz.service';
import { UserService } from '../../../service/user.service';
import { Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {

  id: string;
  quizz: Quizz;
  page: number = 0;
  maxPage: number;
  start: boolean;
  over: boolean;
  checkForm: FormGroup;
  score: number = 0;
  resultIndic: number;
  resultAlert: string;
  resultText: string;
  answerMissing: boolean;
  subscriber = new Subscription()



  constructor(private formBuilder: FormBuilder,
    private quizzService: QuizzService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socket: SocketService,
    private playableQuiz: PlayableQuizzService) { }


  ngOnInit() {
  this.subscriber.add(this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getAllThenCurrent();  
      this.subscriber.add(this.playableQuiz.$playableQuizz.subscribe(quizz => {
        if(quizz) this.getAllThenCurrent();
      }))
      this.subscriber.add(this.socket.$publicQuizzEvent.subscribe(quiz => {
        if(quiz && quiz._id == this.quizz._id) this.router.navigate(['/jouer'])
      }))
    }))
  }

  getAllThenCurrent(){
    this.quizzService.getPlayableQuizz()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        
        this.getCurrent(data)
      })
  }

  getCurrent(quizz){; 
    this.quizz = quizz.filter(quiz => quiz._id = this.id)[0];
    this.quizz != undefined ?  this.initForm()  : this.router.navigate(['/jouer'])
  }

  initForm() {
    this.maxPage = this.quizz.questions.length - 1;
    if (this.quizz.questions[this.page].type == "checkbox") {
      var answers = {};
      for (var i = 0; i < this.quizz.questions[this.page].answers.length; i++) {
        answers["" + i] = false;
      }
      this.checkForm = this.formBuilder.group(answers)
    }
    else {
      this.checkForm = this.formBuilder.group({
        answer: ''
      })
    }
    this.onChanges();
    this.answerMissing = true;
  }

  getAnswers() {
    let answersArray = [];
    return answersArray
  }

  launch() {
    this.start = true;
  }

  onChanges() {
    this.checkForm.valueChanges.subscribe(boxes => {
      this.answerMissing = !Object.values(boxes).some(box => box)
    })
  }

  valider() {
    this.quizzService
      .checkAnswer(this.checkForm.value, this.page, this.id)
      .then(({ data, error }) => {
        if (error) console.log("Error : ", error);
        else if (data) this.score++
      })
      .then(async () => {
        if (this.page < this.maxPage) {
          this.page++;
          this.initForm();
        }
        else {
          const qrt = (this.maxPage + 1) / 4;
          const sc = this.score;
          this.resultIndic = sc > qrt ? (sc > qrt * 2 ? (sc > qrt * 3 ? (sc == qrt * 4 ? 4 : 3) : 2) : 1) : 0;
          this.resultAlert = this.quizzService.textResult[this.resultIndic].class;
          this.resultText = this.quizzService.textResult[this.resultIndic].text;
          this.score = parseInt((this.score * 100 / (this.maxPage + 1)).toFixed());
          this.over = true;
          this.quizzService.endGame(this.id, this.score)
            .subscribe(({ data, error }) => {
              if (error) console.log('Error : ', error);
              this.socket.sendQuizzEndNotif({
                id: this.quizz.createBy._id,
                type: 'quizScoreSend',
                message: data.sender + " vient de terminer votre quiz '" + this.quizz.title + "' avec un score de " + this.score + "%",
                route: '/scores/' + this.quizz._id
              });
            })
        }
      })
  }


  reload() {
    this.page = 0;
    this.score = 0;
    this.over = false;
    this.initForm();
  }

  ngOnDestroy(){
    this.subscriber.unsubscribe()
  }
}
