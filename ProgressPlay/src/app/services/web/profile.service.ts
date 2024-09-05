import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Keys } from '../../models/Enum/Keys';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalService } from '../data/local.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private _httpClient: HttpClient, private _localService: LocalService) { }

  getUserInfo(username: string): Observable<any>{
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.accessToken, false)
    });
    return this._httpClient.get(`${this.baseUrl}/userinfo/${username}`, { headers });
  }

  getProfileImage(username: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.accessToken, false),
    });
    return this._httpClient.get(`${this.baseUrl}/currentimage/${username}`, { headers, responseType: 'blob'});
  }

  changeEmail(username: string, emailChange: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.accessToken, false),
      'Content-Type': 'application/json'
    });
    const body = JSON.stringify({ email: emailChange });
    return this._httpClient.post(`${this.baseUrl}/${username}/changeEmail`, body, { headers });
  }

  uploadImage(username: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', file);
    formData.append('image_name', file.name)

    return this._httpClient.post(`${this.baseUrl}/upload_image/${username}`, formData, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this._localService.get(Keys.accessToken, false)
      })
    });
  }
}
