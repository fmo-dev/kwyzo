import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../auth-utility/auth.service';
import { getLocaleFirstDayOfWeek } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  userForm: FormGroup;

  passwordCorrect: boolean;
  usernameCorrect: boolean;
  mailCorrect: boolean;

  error: string;



  constructor(private formBuilder: FormBuilder,
    private auth: AuthService, private router:Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15), this.noSpace]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, this.noSpace]),
      confirmPassword: new FormControl('')
    }, { validators: this.checkPassword })
  }

  noSpace(control: FormControl) {
    return control.value.replace(/\s/g, "") === control.value ? null : { notSame: true };
  }

  usernameChecker(username) {
    if (username.value.length > 0)
      this.usernameCorrect = username.value.length > 2 ? true : false;
  }

  emailChecker(email) {
    if (email.value.includes(' ')) this.mailCorrect = false;
    else {
      email = email.value.trim();
      if (email.length > 0) {
        let value = email.split('@');
        if (value.length != 2) this.mailCorrect = false;
        else {
          value = value[1].split('.');
          if (value.length != value.filter(valu => valu.trim() != "").length) this.mailCorrect = false;
          else this.mailCorrect = true;
        }
      }
      else this.mailCorrect = null;
    }
  }

  passwordChecker(password1, password2) {
    if (password1.value.length > 0 && password2.value.length > 0)
      this.passwordCorrect = password1.value == password2.value ? true : false;
    else this.passwordCorrect = null;
  }

  checkPassword(group: FormGroup) {
    let password = group.get('password').value;
    let confirmPassword = group.get('confirmPassword').value
    return password === confirmPassword ? null : { notSame: true };
  }

  onSubmitForm() {
    const formValue = this.userForm.value;
    let { userName, email, password } = formValue;
    this.auth
      .create({ user: { userName, email, password } })
      .subscribe(({ data }) => {
        if (data.message) this.error = data.message;
        else {
          localStorage.setItem('token', data.user.token)
          this.auth.createToken(data.user);
          this.auth.logWithToken('/')
        }
      })
  }

  externAuth(app) {
    this.auth.externAuth(app, '/')
  }

}


