import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './others-components/menu/menu.component';
import { CreateComponent } from './quizz-related/create/create.component';
import { EditComponent } from './quizz-related/toEdit/edit/edit.component';
import { PlayComponent } from './quizz-related/toPlay/play/play.component';
import { HeaderComponent } from './others-components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuizzService } from './service/quizz.service';
import { PlayChoiceComponent } from './quizz-related/toPlay/play-choice/play-choice.component';
import { EditChoiceComponent } from './quizz-related/toEdit/edit-choice/edit-choice.component';
import { LogInComponent } from './access-related/log-in/log-in.component';
import { SignUpComponent } from './access-related/sign-up/sign-up.component';

import { TokenInterceptor } from './auth-utility/token.interceptor';
import { FriendsComponent } from './others-components/friends/friends.component';
import { ScoresComponent } from './quizz-related/toEdit/scores/scores.component';
import { ProfilComponent } from './others-components/profil/profil.component';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CreateComponent,
    EditComponent,
    PlayComponent,
    HeaderComponent,
    PlayChoiceComponent,
    EditChoiceComponent,
    LogInComponent,
    SignUpComponent,
    FriendsComponent,
    ScoresComponent,
    ProfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,

  ],
  providers: [
    QuizzService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass : TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
