import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LocalService } from '../../services/data/local.service';
import { Keys } from '../../models/Enum/Keys';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/DB/mUser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  username: string = "";
  emailChange: string = "";
  file!: File
  profileImage: any = {};
  profileImagePath = '';
  user!: User;

  constructor(private _localService: LocalService){}

  ngOnInit(): void {
    document.title = "Profile";
    this.username = this._localService.get(Keys.ActiveUsername, false);
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.file = input.files[0];
    }
  }

  dismissModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.router.navigate([this.route.snapshot.url[0].path]);
  }



}
