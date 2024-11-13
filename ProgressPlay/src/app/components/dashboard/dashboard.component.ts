import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { TodoList } from '../../models/DB/mTodoList';
import { TodoItem } from '../../models/DB/mTodoItems';
import { LocalService } from '../../services/data/local.service';
import { Keys } from '../../models/Enum/Keys';
import { DashboardService } from '../../services/web/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  @ViewChild('completeCheckbox') completeCheckbox: any;

  username: string = "";

  allTodoLists: any[] = [];
  allTodoItems: any[] = [];
  selectedList: TodoList = new TodoList();
  selectedItem:TodoItem = new TodoItem();
  emptyLists: boolean = false;
  editListName: string = "";
  editItemTitle: string = "";
  editItemDescription: string = "";
  editItemDateGoal: Date= new Date();
  newListName: string = "";
  newItemTitle: string = "";
  newItemDescription: string = "";
  newItemDateGoal: Date = new Date()
  item: any;

  constructor(private _localService: LocalService, private _dashboardService: DashboardService){}

  ngOnInit(): void {
    this.username = this._localService.get(Keys.ActiveUsername, false);
    this.load();
  }

  load(){
    this._dashboardService.getAllLists(this.username).subscribe((lists: any)=>{
      this.allTodoLists = lists;
      console.log(lists)
      this.checkEmpty();
      this._dashboardService.getAllItems(this.username).subscribe((items: any)=>{
        this.allTodoItems = items;
        console.log(items)
        this.checkEmpty();
        this.clear();
      })
    })
  }

  clear(){
    this.newItemDateGoal = new Date();
    this.newItemDescription = "";
    this.newItemTitle="";
    this.newListName="";
    this.editItemTitle="";
    this.editItemDateGoal;
    this.editItemDescription="";
    this.editListName="";
    if (this.completeCheckbox) {
      this.completeCheckbox.nativeElement.checked = false;
    }
  }

  checkEmpty() {
    this.emptyLists = this.allTodoLists.length === 0;
    console.log(this.emptyLists);
  }
  
  selectList(list: TodoList){
    this.selectedList = list;
  }

  selectItem(item: TodoItem){
    this.selectedItem = item;
    this.editItemDateGoal = new Date(item.date_goal);
  }


  editList() {
    const username = this.username;
    this._dashboardService.editList(username, this.selectedList.id, this.editListName).subscribe(() => {
      this.load();
    });
  }

  deleteList() {
    this._dashboardService.deleteList(this.username, this.selectedList.id).subscribe(() => {
      this.load();
    });
  }

  addItem() {
    const item: TodoItem = {
      id: 0,
      title: this.newItemTitle,
      description: this.newItemDescription,
      date_goal: this.newItemDateGoal,
      user_id: 0,
      date_created : new Date() 
    };
    this._dashboardService.addItem(this.username, this.selectedList.id,item).subscribe(() => {
      this.load();
    });
  }

  editItem() {
    this._dashboardService.editItem(this.username, this.selectedItem.id, this.editItemTitle, this.editItemDescription, this.editItemDateGoal, this.selectedItem.date_goal).subscribe(() => {
      this.load();
    });
  }

  deleteItem() {
    this._dashboardService.deleteItem(this.username, this.selectedItem.id).subscribe(() => {
      this.load();
    });
  }
  openCreateListModal() {
    this.newListName = '';
  }
  completeTask(){
    this._dashboardService.completeItem(this.username, this.selectedItem.id).subscribe(()=>{
      this.load();
    });
  }
  createList() {
    this._dashboardService.createList(this.username, this.newListName).subscribe(() => {
      this.newListName = '';
      this.load();
    });
  }

  dateCondition(item: TodoItem): number{
    if (item.date_completed==null && new Date(item.date_goal)<new Date()) return 1;
    else if (item.date_completed==null && new Date(item.date_goal)>=new Date()) return 2;
    else if (item.date_completed!=null) return 3;
    else return 0;
  }
  
  
}
