import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { QuizzService } from '../../../service/quizz.service';
import { Quizz } from '../../../model/quizz.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../../../service/socket.service';
import { EditableQuizzService } from '../../../service/editable-quizz.service';
import { UserService } from '../../../service/user.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  id: string;
  currentQuizz: Quizz;
  answersMissing: boolean
  quizzForm: FormGroup;
  questions: FormArray;
  delete: boolean
  allowed: boolean;
  subscriber = new Subscription();

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socket: SocketService,
    private editableQuizz: EditableQuizzService,
    private quizzService: QuizzService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getAllThenCurrent(); 
      this.subscriber.add(this.editableQuizz.$editableQuizz.subscribe(data => {
        if (data) this.getCurrent(data);
      }))
    })
  }

  getAllThenCurrent(){
    this.quizzService.getAllOfUser()
      .subscribe(({ data, error }) => {
        if (error) console.log("Error : ", error);
        this.getCurrent(data)
      })
  }

  getCurrent(quizz){
    this.currentQuizz = quizz.filter(quiz => quiz._id == this.id)[0]
    this.currentQuizz != undefined ?  this.initForm() : this.router.navigate(['/modifier'])
  }
  
  initForm() {
    this.quizzForm = this.formBuilder.group({
      title: new FormControl(this.currentQuizz.title, Validators.required),
      isPublic: new FormControl(this.currentQuizz.isPublic),
      description: new FormControl(this.currentQuizz.description, Validators.required),
      questions: this.formBuilder.array(this.getQuestions())
    });
    this.onChanges();
  }

  deleteOn() {
    this.delete = true;
  }

  deleteOff() {
    this.delete = false;
  }

  deleteQuizz() {
    this.quizzService.delete(this.id)
      .subscribe(({ data, error }) => {
        if (error) {
          console.log("Error : ", error);
        }
        else {
          this.socket.sendQuizNotif({
            id: this.id,
            type: "quizNotif",
            message: data.creator + " a supprimé le quiz '" + this.currentQuizz.title + "'",
            route: '/jouer',
            concerned: data.concerned
          });
          this.router.navigate(['/edit']);
        }
      })
  }


  getQuestions() {
    let questionsArray = [];
    this.currentQuizz.questions.forEach(question => {
      questionsArray.push(this.formBuilder.group({
        question: new FormControl(question.question, Validators.required),
        answers: this.formBuilder.array(this.getAnswers(question))
      }))
    });
    return questionsArray;
  }

  getAnswers(question) {
    let answersArray = []
    question.answers.forEach(answer => {
      answersArray.push(this.formBuilder.group({
        answer: new FormControl(answer.answer, Validators.required),
        isCorrect: answer.isCorrect
      }));
    });
    return answersArray
  }

  createQuestion() {
    return this.formBuilder.group({
      question: new FormControl('', Validators.required),
      answers: this.formBuilder.array([this.createAnswer()])
    });
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
    });
  }

  addAnswer(i) {
    this.questions = this.quizzForm.get('questions') as FormArray;
    const answers = this.questions.controls[i].get('answers') as FormArray;
    answers.push(this.createAnswer());
  }

  deleteAnswer(i, j) {
    this.questions = this.quizzForm.get('questions') as FormArray;
    const answers = this.questions.controls[i].get('answers') as FormArray;
    answers.removeAt(j);
  }

  onChanges() {
    this.quizzForm.get('questions').valueChanges.subscribe(questions => {
      this.answersMissing = questions.some(question => question.answers.some(answer => answer.isCorrect == true) == false)
    });
  }



  onSubmitForm() {
    const formValue = this.quizzForm.value;
    const quizz = new Quizz({ ...formValue })
    this.quizzService
      .update(this.id, quizz)
      .subscribe(({ data, error }) => {
        if (error) {
          console.log("Error : ", error);
        }
        else {
          this.socket.sendQuizNotif({
            id: this.id,
            type: "quizNotif",
            message: data.creator.userName + " a mis à jour le quiz '" + this.currentQuizz.title + "'",
            route: '/jouer/' + this.id,
            concerned: data.concerned
          })
          if (quizz.isPublic != this.currentQuizz.isPublic) {
            quizz._id = this.currentQuizz._id;
            quizz.createBy = new User({_id : data.creator.id, userName : data.creator.userName });
            this.socket.sendQuizzUpdate(quizz)
          }
          this.router.navigate(['/']);
        }
      })
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe()
  }

}
