import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.css'
})
export class RewardsComponent {
  slideContent: any = [];
  showRewardsRow: boolean = true;
  rewards: any = [];

  calculateStatus(index: number){

  }
  viewScores(){

  }
  toggleRewardsRow(){

  }
  handleImageClick(index: number, reward_id: number){

  }
  fetchStatus(reward_id: number){
    
  }
}
