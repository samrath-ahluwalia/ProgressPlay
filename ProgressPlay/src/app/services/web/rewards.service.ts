import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Keys } from '../../models/Enum/Keys';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalService } from '../data/local.service';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {

  constructor() { }
}
