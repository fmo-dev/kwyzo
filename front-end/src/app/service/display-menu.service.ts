import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayMenuService {

  $menuDisplay = new BehaviorSubject<boolean>(false);

  constructor() { }

  changeStatut(value:boolean){
    this.$menuDisplay.next(value);
  }
}
