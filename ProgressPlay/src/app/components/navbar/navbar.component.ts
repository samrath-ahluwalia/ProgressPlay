import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Keys } from '../../models/Enum/Keys';
import { LocalService } from '../../services/data/local.service';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentTheme: Theme = 'dark';

  constructor(private _localService: LocalService, private themeService: ThemeService){}

  ngOnInit() {
    this.themeService.activeTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  logout(){
    this._localService.delete(Keys.ActiveUsername)
    this._localService.delete(Keys.ActiveUserID)
    this._localService.delete(Keys.AccessToken)
    this._localService.delete(Keys.ActiveUserInfo)
    console.log("uda diya :)")
  }
}
