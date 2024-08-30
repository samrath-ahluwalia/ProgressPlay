import { Component } from '@angular/core';
import { SignupForm } from '../../models/form/signup';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private _userService : UserService){
    
  }
  signupForm : SignupForm = new SignupForm();
  handleSignup (){
    this._userService.Signup(this.signupForm).subscribe(data=>{
      console.log(data);
    })

  }
}
