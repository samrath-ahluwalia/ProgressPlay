import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LocalService } from '../../services/data/local.service';
import { Keys } from '../../models/Enum/Keys';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  username: string = "";

  constructor(private _localService: LocalService){}


  ngOnInit(): void {
    this.username = this._localService.get(Keys.ActiveUsername, false);
  }

}
