import { Component, OnInit } from '@angular/core';
import { QuizzService } from '../../service/quizz.service';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  user: User;
  subscriber= new Subscription()
  constructor(private userService: UserService) { }


  ngOnInit() {
    this.subscriber.add(this.userService.$currentUser.subscribe(value => { if(value) this.user = value.user }))
  }

}
