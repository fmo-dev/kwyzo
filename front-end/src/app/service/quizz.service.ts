import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quizz } from '../model/quizz.model'
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
// @ts-ignore
const config = require('../../assets/config.json')
const url = config.quizzUrl;

@Injectable({
  providedIn: 'root'
})
export class QuizzService {
  textResult = [
    {
      class : 'alert-danger',
      text : 'Peut-être que vous devriez changer de thème ...'
    },
    {
      class : 'alert-warning',
      text : 'Il y a encore du travail !'
    },
    {
      class : 'alert-primary',
      text : 'Je suis sûr que vous pouvez faire mieux !'
    },
    {
      class : 'alert-info',
      text : 'Bravo, vous êtes à l\'aise sur le sujet !'
    },
    {
      class : 'alert-success',
      text : 'Félicitation ! C\'est un sans faute !'
    }
  ]

  constructor(private http: HttpClient) { }


  getOneEdit(id){ 
    return this.http.get<{data: any, error:Error}>(url + "edit/" + id)
    .pipe(
      map(({data, error}) => {
        return {data, error}
      })
    )
  }
  
  getAll(){
    return this.http.get<{data: any, error: Error}>(url)
    .pipe(
      map(({data, error}) => {
        if(!error) {
          data = data.map(_current => {
            return new Quizz(_current)
          });
        }
        return { data, error};
      })
    )
  }

  getAllOfUser(){
    return this.http.get<{data: any, error: Error}>(url +"user/edit")
    .pipe(
      map(({data, error}) => {
        if(!error) {
          data = data.map(_current => {
            return new Quizz(_current)
          });
        }
        return { data, error};
      })
    )
  }

  getPlayableQuizz(){
    return this.http.get<{data: any, error: Error}>(url +"/user/play")
    .pipe(
      map(({data, error}) => {
        if(!error) data.map(_current => _current.quiz = new Quizz(_current.quiz));
        data = data.map(each => ({ ...each.quiz, ofFriend: each.ofFriend })) 
        return { data, error};
      })
    )
  }


  checkAnswer(answers, question, id){
    return this.http.post<{data: Boolean, error:Error}>(url + "/" + id, {question, answers})
    .toPromise()
  }

  create(quizz){
    return this.http.post<{data: any, error:Error}>(url, quizz)
    .pipe(
      map(({data, error}) => {
        return {data, error}
      })
    )
  }

  update(id, quizz:Quizz) {
    return this.http.put<{data: any, error:Error}>(url + "/" + id, quizz)
    .pipe(
      map(({data, error}) => {
        return {data, error}
      })
    )
  }

  delete(id){
    return this.http.delete<{data: any, error:Error}>(url + '/' + id)
    .pipe(
      map(({data, error}) => {
        return {data, error};
      })
    )
  }

  endGame(id, score){
    return this.http.post<{data: any, error: Error}>(url +'/end/' +  id, {score})
    .pipe(
      map(({data, error}) => {
        return {data, error};
      })
    )
  }



}
