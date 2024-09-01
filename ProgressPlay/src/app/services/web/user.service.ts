import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignupForm } from '../../models/form/signup';
import { LoginForm } from '../../models/Form/login';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private _httpClient: HttpClient) { }

  signup(signupForm: SignupForm): Observable<any> {
    const url = `${this.baseUrl}/signup`;
    const body = {
      username: signupForm.userName,
      email: signupForm.email,
      password: signupForm.password
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(url, body, { headers })
  }

  login(loginForm: LoginForm): Observable<any> {
    const url = `${this.baseUrl}/login`;
    const body = {
      username: loginForm.username,
      password: loginForm.password
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(url, body, { headers, observe: 'response' })
  }

}
