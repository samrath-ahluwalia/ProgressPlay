import { Component } from '@angular/core';
import { SignupForm } from '../../models/form/signup';
import { UserService } from '../../services/web/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [UserService]
})
export class SignupComponent {

  constructor(private _userService : UserService, private _router: Router){ }

  signupForm : SignupForm = new SignupForm();
  signupSuccess: boolean = false;
  message: string = "";

  handleSignup(){
    this._userService.signup(this.signupForm).subscribe((response: any) => {
      this.message = response.message;
      this.showModal('signupSuccess');
    },
    error => {
      this.message = error.error.message;
      this.showModal('signupFail');
    })
  }

  showModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  dismissModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    if (modalId === 'signupSuccess') {
      this._router.navigate(['/']);
    }
  }
}
