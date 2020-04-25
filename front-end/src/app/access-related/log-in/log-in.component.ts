import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth-utility/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  userForm: FormGroup;
  error : string;
  url: string;
  subscriber: Subscription;

  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.url = this.route.snapshot.paramMap.get('url') || '/';
    if(this.auth.token != undefined) this.auth.logWithToken(this.url);
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }

  onSubmitForm() {
    const formValue = this.userForm.value;
    const { email, password } = formValue;
    this.auth.logIn({user : { email, password}})
    .then(() => this.router.navigate([this.url]))
    .catch( (err) => {
      this.error = err.message;
    })
  }

  externAuth(app){
    this.auth.externAuth(app,this.url)
  }
}
