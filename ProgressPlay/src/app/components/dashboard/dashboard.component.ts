import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  allTodoLists: any = [];
  allTodoItems: any = [];
  selectedList: any = "selectedList";
  dateCondition: boolean = false;
  emptyLists: any = []
}
