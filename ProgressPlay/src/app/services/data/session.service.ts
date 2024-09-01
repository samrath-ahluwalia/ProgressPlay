import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }
  get(key: string, isObject: boolean): any{
    let value = sessionStorage.getItem(key);

    if(isObject && value!= null){
      value = JSON.parse(value);
    }
    let data = value;
    return data;
  }
  set(key: string, value: any, isObject: boolean){
    let data = value;
    if(isObject){
      data = JSON.stringify(data);
    }
    sessionStorage.setItem(key, data);
  }
  delete(key: string){
    sessionStorage.removeItem(key);
  }

}
