import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Keys } from '../../models/Enum/Keys';
import { LocalService } from '../../services/data/local.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private _localService: LocalService){}
  logout(){
    this._localService.delete(Keys.ActiveUsername)
    this._localService.delete(Keys.ActiveUserID)
    this._localService.delete(Keys.AccessToken)
    this._localService.delete(Keys.ActiveUserInfo)
    console.log("uda diya :)")
  }
}
