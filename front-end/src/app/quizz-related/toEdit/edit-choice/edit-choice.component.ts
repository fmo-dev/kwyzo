import { Component, OnInit, OnDestroy } from '@angular/core';
import { Quizz } from '../../../model/quizz.model';
import { QuizzService } from '../../../service/quizz.service';
import { EditableQuizzService } from '../../../service/editable-quizz.service';
import { UserService } from '../../../service/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-choice',
  templateUrl: './edit-choice.component.html',
  styleUrls: ['./edit-choice.component.scss']
})
export class EditChoiceComponent implements OnInit, OnDestroy {

  quizz: Quizz[] = [];
  subscriber = new Subscription();

  constructor(private editableQuizz: EditableQuizzService,
    private quizzService: QuizzService) { }

  ngOnInit() {
    this.editableQuizz.$editableQuizz.subscribe(data => {
      if (data) this.quizz = data;
    });
    console.log(this.quizz);
    
    this.getQuizz();
  }

  getQuizz() {
    this.quizzService.getAllOfUser()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.quizz = data;
      })
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe()
  }

}
