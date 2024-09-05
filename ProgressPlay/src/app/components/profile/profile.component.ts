import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LocalService } from '../../services/data/local.service';
import { Keys } from '../../models/Enum/Keys';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/DB/mUser';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../services/web/profile.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  file: File | null = null;
  username: string = '';
  newEmail: string = '';
  profileImageUrl!: SafeUrl;
  profileImage: any;
  user!: User;
  emailChange: string =  '';

  constructor(private _localService: LocalService, private _profileService: ProfileService, private _route: ActivatedRoute,
    private _router: Router, private _sanitizer: DomSanitizer){}

  ngOnInit(): void {
    document.title = "Profile";
    this.username = this._localService.get(Keys.ActiveUsername, false);
    this.fetchProfileImage(this.username);
  }

  fetchProfileImage(username: string): void {
    this._profileService.getProfileImage(username).subscribe({
      next: (imageBlob: Blob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.profileImageUrl = this._sanitizer.bypassSecurityTrustUrl(objectURL); // Bypass Angular security checks for URLs
        
      },
      error: (err) => {
        console.error('Error fetching image', err);
      }
  })
  }

  onFileChange(event: any): void {
    this.file = event.target.files[0];
  }

  uploadImage(): void {
    if (this.file && this.username) {
      this._profileService.uploadImage(this.username, this.file).subscribe(
        (data:any) => {
          this.showSuccessModal();
          this.fetchProfileImage(this.username);
        },
        (data:any) => {
          this.showFailureModal();
        }
      );
    }
  }

  changeEmail(): void {
    const username = this._route.snapshot.paramMap.get('username');
    if (username) {
      this._profileService.changeEmail(username, this.emailChange).subscribe(
        () => {
          this.showEmailSuccessModal();
        },
        () => {
          this.showEmailFailureModal();
        }
      );
    }
  }
  
  showSuccessModal(): void {
    const modal = document.getElementById('uploadSuccessModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  showFailureModal(): void {
    const modal = document.getElementById('uploadFailureModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  showEmailSuccessModal(): void {
    const modal = document.getElementById('emailSuccessModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  showEmailFailureModal(): void {
    const modal = document.getElementById('emailFailureModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  dismissSuccessModal(): void {
    const modal = document.getElementById('uploadSuccessModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this._router.navigate(['profile']);
  }

  dismissFailureModal(): void {
    const modal = document.getElementById('uploadFailureModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  dismissEmailSuccessModal(): void {
    const modal = document.getElementById('emailSuccessModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this._router.navigate(['/profile']);
  }

  dismissEmailFailureModal(): void {
    const modal = document.getElementById('emailFailureModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }
  
}
