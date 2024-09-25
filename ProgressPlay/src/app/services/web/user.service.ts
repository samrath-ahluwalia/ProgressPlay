import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Keys } from '../../models/Enum/Keys';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginForm } from '../../models/Form/login';
import { LocalService } from '../data/local.service';
import { SignupForm } from '../../models/form/signup';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private _httpClient: HttpClient, private _localService: LocalService) { }

  getUserInfo(username: string): Observable<any>{
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.accessToken, false)
    });
    return this._httpClient.get(`${this.baseUrl}/userinfo/${username}`, { headers });
  }

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
