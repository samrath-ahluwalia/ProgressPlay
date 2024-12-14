import { Component } from '@angular/core';
import { LoginForm } from '../../models/Form/login';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/web/user.service';
import { Keys } from '../../models/Enum/Keys';
import { LocalService } from '../../services/data/local.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new LoginForm();
  message: string = "";

  constructor(private _userService: UserService, private _localService: LocalService, private _router: Router){}

  handleLogin(){
    this._userService.login(this.loginForm).subscribe((response: any) => {
      console.log(response)
      if(response.status === 200){
        this._localService.set(Keys.AccessToken, response.body.access_token, false)
        this._localService.set(Keys.ActiveUsername, this.loginForm.username, false)
        this._localService.set(Keys.ActiveUserID, response.body.userinfo.userid, false)
        this._router.navigate(['/homepage'])
      } 
      else if (response.status === 401) {
        alert('Invalid credentials');
      } else if (response.status === 403) {
        alert('You are not permitted to access this page.');
      } else {
        alert('There has been some error. Please try again.');
      }
  })
  }
}
