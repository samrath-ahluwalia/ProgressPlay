import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Keys } from '../../models/Enum/Keys';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalService } from '../data/local.service';
import { TodoItem } from '../../models/DB/mTodoItems';
import { TodoList } from '../../models/DB/mTodoList';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private _httpClient: HttpClient, private _localService: LocalService) { }

  getAllLists(username: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    return this._httpClient.get(`${this.baseUrl}/${username}/getalllists`, { headers });
  }

  getAllItems(username: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    return this._httpClient.get(`${this.baseUrl}/${username}/getallitems`, { headers });
  }

  getPreviousLists(username: string): Observable<any>{
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    })
    return this._httpClient.get(`${this.baseUrl}/${username}/deletedlists`, { headers })
  }

  createList(username: string, name: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(`${this.baseUrl}/${username}/addlist`, { name }, { headers });
  }

  editList(username: string, listId: number, name: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(`${this.baseUrl}/${username}/editlist/${listId}`, { name }, { headers });
  }

  addItem(username: string, listid: number, item: TodoItem): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(`${this.baseUrl}/${username}/${listid}/additem`, item, { headers });
  }

  editItem(username: string, itemId: number, title: string, description: string, date_goal: Date, selectedItemDateGoal: Date): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    let item: any = {};
    if(title!="") item['title'] = title;
    if(description!="") item['description'] = description;
    if(date_goal!=selectedItemDateGoal) item['date_goal'] = date_goal;
    return this._httpClient.post(`${this.baseUrl}/${username}/edititem/${itemId}`, item, { headers });
  }

  deleteList(username: string, listId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(`${this.baseUrl}/${username}/${listId}/deletelist`, {}, { headers });
  }

  deleteItem(username: string, itemId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(`${this.baseUrl}/${username}/${itemId}/deleteitem`, {}, { headers });
  }

  completeItem(username: string, itemId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(`${this.baseUrl}/${username}/${itemId}/completeitem`, {}, { headers});
  }

  listCount(username: string): Observable<any>{
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this._localService.get(Keys.AccessToken, false),
      'Content-Type': 'application/json'
    });
    return this._httpClient.post(`${this.baseUrl}/${username}/listcount`, {}, { headers}); 
  }

}
