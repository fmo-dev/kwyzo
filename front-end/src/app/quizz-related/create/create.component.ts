import { Component, OnInit } from '@angular/core';
import { Quizz } from '../../model/quizz.model'
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { QuizzService } from '../../service/quizz.service';
import { Router } from '@angular/router';
import { SocketService } from '../../service/socket.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  answersMissing: boolean;
  quizzForm: FormGroup;
  questions: FormArray;
  
  constructor(private formBuilder: FormBuilder, 
              private quizzService: QuizzService,
              private router: Router,
              private socket: SocketService) { }

  ngOnInit() {
    this.initForm();
    this.onChanges();
  }

  initForm() {
    this.quizzForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      isPublic: new FormControl(false),
      description: new FormControl('', Validators.required),
      questions: this.formBuilder.array([])
    })
  }

  createQuestion() {
    return this.formBuilder.group({
      question: new FormControl('', [Validators.required]),
      answers: this.formBuilder.array([this.createAnswer()])
    })
  }

  addQuestion() {
    this.questions = this.quizzForm.get('questions') as FormArray;
    this.questions.push(this.createQuestion());
  }

  deleteQuestion(i) {
    this.questions = this.quizzForm.get('questions') as FormArray;
    this.questions.removeAt(i);
  }

  createAnswer() {
    return this.formBuilder.group({
      answer: new FormControl('', Validators.required),
      isCorrect: false
    })
  }

  addAnswer(i) {
    this.questions = this.quizzForm.get('questions') as FormArray;
    const answers = this.questions.controls[i].get('answers') as FormArray;
    answers.push(this.createAnswer());
  }

  deleteAnswer(i, j) {
    this.questions = this.quizzForm.get('questions') as FormArray;
    const answers = this.questions.controls[i].get('answers') as FormArray;
    answers.removeAt(j)
  }

  onChanges() {
    this.quizzForm.get('questions').valueChanges.subscribe(questions => {
      this.answersMissing = questions.some(question => question.answers.some(answer => answer.isCorrect == true) == false)
    })
  }

  onSubmitForm() {
    const formValue = this.quizzForm.value;
    const quizz = new Quizz({ ...formValue })
    this.quizzService
      .create(quizz)
      .subscribe(({ data, error }) => {
        if (error) {
          console.log("Error : ", error);
        }
        else {
          this.socket.sendQuizNotif({
            type: "quizNotif",
            message: data.creator + " a créé le quiz '"+ quizz.title + "'" ,
            route: '/jouer/' + data.id,
            concerned: data.concerned
          })
          this.router.navigate(['/']);
        }
      })
  }

}
