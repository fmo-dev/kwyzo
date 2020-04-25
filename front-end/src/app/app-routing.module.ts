import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { MenuComponent } from './others-components/menu/menu.component';
import { CreateComponent } from './quizz-related/create/create.component';
import { EditComponent } from './quizz-related/toEdit/edit/edit.component';
import { PlayComponent } from './quizz-related/toPlay/play/play.component';
import { PlayChoiceComponent } from './quizz-related/toPlay/play-choice/play-choice.component';
import { EditChoiceComponent } from './quizz-related/toEdit/edit-choice/edit-choice.component';
import { LogInComponent } from './access-related/log-in/log-in.component';
import { SignUpComponent } from './access-related/sign-up/sign-up.component';
import { AuthGuardService as AuthGuard  } from './auth-utility/auth-guard.service';
import { FriendsComponent } from './others-components/friends/friends.component';
import { ScoresComponent } from './quizz-related/toEdit/scores/scores.component';
import { LogGuardService as LogGuard} from './auth-utility/log-guard.service';
import { ProfilComponent } from './others-components/profil/profil.component';

const appRoutes: Routes = [
    { path: '', component: MenuComponent, canActivate: [AuthGuard]},
    { path: 'connexion', component: LogInComponent, canActivate: [LogGuard] },
    { path: 'inscription', component: SignUpComponent, canActivate: [LogGuard] },
    { path: 'creer', component: CreateComponent, canActivate: [AuthGuard] },
    { path: 'modifier', component: EditChoiceComponent, canActivate: [AuthGuard] },
    { path: 'modifier/:id', component: EditComponent, canActivate: [AuthGuard] },
    { path: 'scores/:id', component: ScoresComponent, canActivate: [AuthGuard]},
    { path: 'jouer', component: PlayChoiceComponent, canActivate: [AuthGuard] },
    { path: 'jouer/:id', component: PlayComponent, canActivate: [AuthGuard] },
    { path: 'amis', component: FriendsComponent , canActivate: [AuthGuard]},
    { path: 'profil', component: ProfilComponent , canActivate: [AuthGuard]},
    { path: '**', redirectTo: '' }
  ];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        [AuthGuard],
        [LogGuard]
    ]
})

export class AppRoutingModule {}