import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/web/user.service';
import { LocalService } from '../../services/data/local.service';
import { Keys } from '../../models/Enum/Keys';

@Component({
  selector: 'app-rewards',
  standalone:true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})
export class RewardsComponent implements OnInit {
  username: string = "";
  uData: any;
  slideContent = [
    { image: "/images/1.png", caption: "White Warrior badge", data: "500 points" },
    { image: "/images/4.png", caption: "Dark Floyd badge", data: "1000 points" },
    { image: "/images/6.png", caption: "Blue Ninja badge", data: "2000 points" },
    { image: "/images/5.png", caption: "Red Pirate badge", data: "5000 points" },
    { image: "/images/2.png", caption: "Green Soldier badge", data: "7500 points" },
    { image: "/images/7.png", caption: "Yellow Samurai badge", data: "10000 points" },
    { image: "/images/3.png", caption: "More badges coming soon", data: "10000+ points" }
  ];
  rewards = [
    { id: 1, title: "White Warrior", image: "/images/1.png" },
    { id: 2, title: "Dark Floyd", image: "/images/4.png" },
    { id: 3, title: "Blue Ninja", image: "/images/6.png" },
    { id: 4, title: "Red Pirate", image: "/images/5.png" },
    { id: 5, title: "Green Soldier", image: "/images/2.png" },
    { id: 6, title: "Yellow Samurai", image: "/images/7.png" }
  ];
  clickedImageIndex: number = -1;
  isAnimating: boolean = false;
  originalPosition: any = { top: null, left: null };

  constructor(private _userService: UserService, private _localService: LocalService) {}

  ngOnInit(): void {
    this.username = this._localService.get(Keys.ActiveUsername, false);
    this._userService.getUserInfo(this.username).subscribe((userData: any) => {
      console.log(userData);
      this.uData = userData;
    });
  }

  viewScores(): void {
    const message = `${this.username}'s score: ${this.uData?.score}`;
    alert(message);
  }

  // toggleRewardsRow(): void {
  //   this.showRewardsRow = !this.showRewardsRow;
  // }

  fetchStatus(rewardId: number): string {
    const index = this.rewards.findIndex(reward => reward.id === rewardId);
    return index !== -1 ? this.calculateStatus(index) : 'Status not available';
  }

  calculateRequiredPoints(index: number): number {
    const pointsRequired = [50, 1000, 2000, 3500, 5000, 10000];
    return index < pointsRequired.length ? pointsRequired[index] : 0;
  }

  calculateStatus(index: number): string {
    const requiredPoints = this.calculateRequiredPoints(index);
    return this.uData?.score >= requiredPoints ? 'Unlocked' : 'Locked';
  }

  handleImageClick(index: number, rewardId: number): void {
    if (this.fetchStatus(rewardId) === 'Unlocked') {
      if (this.isAnimating && this.clickedImageIndex === index) {
        this.handleAnimationReset();
      } else if (!this.isAnimating) {
        this.startImageAnimation(index);
      } else {
        alert("Another image is currently animating. Please wait or click on it to reset.");
      }
    } else {
      alert("This reward is not unlocked yet.");
    }
  }

  startImageAnimation(index: number): void {
    this.isAnimating = true;
    this.clickedImageIndex = index;
    const image = document.getElementById(`rewardImage-${index}`);
    this.originalPosition = { top: image?.offsetTop, left: image?.offsetLeft };

    Object.assign(image!.style, {
      position: 'fixed',
      zIndex: '9999',
      width: '200px',
      height: '200px',
      top: '40%',
      left: '40%',
      transform: 'translate(-50%, -50%)',
      filter: 'brightness(130%)',
      borderRadius: '50%',
      cursor: 'pointer'
    });

    image?.classList.add('animate-flip');
    image?.addEventListener('click', () => this.handleAnimationReset());
  }

  handleAnimationReset(): void {
    const image = document.getElementById(`rewardImage-${this.clickedImageIndex}`);
    Object.assign(image!.style, {
      position: 'static',
      zIndex: 'auto',
      width: '100px',
      height: '100px',
      top: `${this.originalPosition.top}px`,
      left: `${this.originalPosition.left}px`,
      transform: 'none',
      filter: 'brightness(100%)',
      borderRadius: '0%',
      cursor: 'default'
    });
    image?.classList.remove('animate-flip');
    this.isAnimating = false;
    this.clickedImageIndex = -1;
  }
}
