import { Component, OnInit } from '@angular/core';
import { DisplayMenuService } from './service/display-menu.service';
import { AuthService } from './auth-utility/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'Kwyzo';

  constructor(private displayMenu : DisplayMenuService,
    private auth: AuthService){
  }

  closeHeader(){
    this.displayMenu.changeStatut(false);
  }

}
