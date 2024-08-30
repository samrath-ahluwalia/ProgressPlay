import { SignupForm } from '../models/form/signup';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _httpClient: HttpClient) {

   }
   Signup(signupForm: SignupForm):Observable<any>{
    const url = "http://127.0.0.1:5000/signup";
    const body = {
      username: signupForm.userName,
      email : signupForm.email,
      password : signupForm.password
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(url, body, { headers });
   }
  }
   
