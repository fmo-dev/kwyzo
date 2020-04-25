import { Component, OnInit } from '@angular/core';
import { Quizz } from '../../../model/quizz.model';
import { Router, ActivatedRoute } from '@angular/router';
import { EditableQuizzService } from '../../../service/editable-quizz.service';
import { Subscription } from 'rxjs';
import { QuizzService } from 'src/app/service/quizz.service';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnInit {

  id: string;
  currentQuiz: Quizz;
  scoreArray: any[];
  subscriber = new Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private editableQuizz: EditableQuizzService,
    private router: Router,
    private quizzService: QuizzService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getAllThenCurrent()
      this.subscriber.add(this.editableQuizz.$editableQuizz.subscribe(data => {
        if (data) this.getCurrent(data)
      })
      )
    })
  }

  getAllThenCurrent() {
    this.quizzService.getAllOfUser()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.getCurrent(data)
      })
  }

  getCurrent(quizz) {
    this.currentQuiz = quizz.filter(quiz => quiz._id == this.id)[0]
    this.currentQuiz != undefined ?  this.sortScores() : this.router.navigate(['/modifier'])
  }

  sortScores() {
    this.scoreArray = this.currentQuiz.scoreArray.filter(score => score.score);
    this.scoreArray.sort((a, b) => b.score - a.score)
  }
}