import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  userForm: FormGroup;
  passwordForm: FormGroup;
  user: User;
  isOk: string
  subscriber = new Subscription();
  usernameCorrect = true;
  emailCorrect = true;
  passwordCorrect : boolean;
  oldPasswordCorrect: boolean;
  changingPassword = false;
  displaySuccess = false;
  error:string;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService) { }

  ngOnInit() {
    this.subscriber.add(this.userService.$currentUser.subscribe(data => {
      if (data) {
        this.user = data.user
        this.initForm();
      }
    }))
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      userName: new FormControl(this.user.userName, [Validators.required, Validators.minLength(3), Validators.maxLength(15), this.noSpace]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email])
    })
    this.passwordForm = this.formBuilder.group({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, this.noSpace]),
      confirmPassword: new FormControl('')
    }, { validators: this.checkPassword})
  }


  usernameChecker(username) {
    if (username.value.length > 0)
      this.usernameCorrect = username.value.length > 2 ? true : false;
  }

  emailChecker(email) {
    if (email.value.includes(' ')) this.emailCorrect = false;
    else {
      email = email.value.trim();
      if (email.length > 0) {
        let value = email.split('@');
        if (value.length != 2) this.emailCorrect = false;
        else {
          value = value[1].split('.');
          if (value.length != value.filter(valu => valu.trim() != "").length) this.emailCorrect = false;
          else this.emailCorrect = true;
        }
      }
      else this.emailCorrect = null;
    }
  }

  passwordChecker(password1, password2, oldPassword) {
    const p0 = oldPassword.value
    const p1 = password1.value;
    const p2 = password2.value;
    if (password1.value.length > 0 && password2.value.length > 0) 
      this.passwordCorrect = p0 != p1 ? ( p1 == p2 ? true : false) : false;
    else this.passwordCorrect = null;
  }

  oldPasswordChecker(oldPassword){
    this.userService.checkPassword(oldPassword.value)
    .subscribe( result => {
      this.oldPasswordCorrect = result
    })
  }


  checkPassword(group: FormGroup) {
    let password = group.get('newPassword').value;
    let confirmPassword = group.get('confirmPassword').value
    if(password == group.get('oldPassword').value) return { same: true };
    else return password === confirmPassword ? null : { notSame: true };
  }

  noSpace(control: FormControl) {
    return control.value.replace(/\s/g, "") === control.value ? null : { notSame: true };
  }

  changePassword() {
    this.changingPassword = !this.changingPassword;
  }

  onSubmitContacts(){
    const formValue = this.userForm.value;
    if(formValue.userName == this.user.userName && formValue.email == this.user.email) return
    this.userService.editContacts(formValue)
    .subscribe( (data:any) => {
      if(data.message) {
        this.displaySuccess = false;
        this.error = data.message;
      }
      else {
        console.log('joj');
        
        this.userService.$currentUser.next({user : new User(data), update: true});
        this.displaySuccess = true;
        this.error = null;
      }
    })
  }

  onSubmitPassword(){
    const formValue = this.passwordForm.value;
    this.userService.editPassword({ password : formValue.newPassword })
    .subscribe( ({data, error}) => this.displaySuccess = true)
  }


}
