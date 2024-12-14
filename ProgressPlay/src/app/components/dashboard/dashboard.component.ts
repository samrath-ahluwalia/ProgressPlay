import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { TodoList } from '../../models/DB/mTodoList';
import { TodoItem } from '../../models/DB/mTodoItems';
import { LocalService } from '../../services/data/local.service';
import { Keys } from '../../models/Enum/Keys';
import { DashboardService } from '../../services/web/dashboard.service';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, NgxEchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  @ViewChild('completeCheckbox') completeCheckbox: any;

  username: string = "";

  allTodoLists: any[] = [];
  allTodoItems: any[] = [];
  deletedTodoLists: any[] = [];
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
  chartOptions: any;
  isTabActive: boolean = true;

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
        this.updateChartData();
        this.checkEmpty();
        this._dashboardService.getPreviousLists(this.username).subscribe((deletedLists: any)=>{
          this.deletedTodoLists = deletedLists.sort((a: { date_created: string | number | Date; }, b: { date_created: string | number | Date; }) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
          console.log(deletedLists)
        })
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

  updateChartData(): void {
    const pendingTasks = this.pendingTasksCount;
    const completedTasks = this.completedTasksCount;
    const overdueTasks = this.overdueTasksCount;

    this.chartOptions = {
      title: {
        text: 'Tasks Overview',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Tasks',
          type: 'pie',
          radius: '50%',
          data: [
            { value: pendingTasks, name: 'Pending Tasks' },
            { value: completedTasks, name: 'Completed Tasks' },
            { value: overdueTasks, name: 'Overdue Tasks' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  editList() {
    const username = this.username;
    this._dashboardService.editList(username, this.selectedList.id, this.editListName).subscribe(() => {
      this.load();
    });
  }

  get pendingTasksCount(): number {
    return this.allTodoItems.filter(item => !item.date_completed).length;
  }
  
  get overdueTasksCount(): number {
    const today = new Date();
    return this.allTodoItems.filter(
      item => item.date_completed == null && new Date(item.date_goal) < today
    ).length;
  }

  get completedTasksCount(): number {
    return this.allTodoItems.filter(item => item.date_completed).length;
  }

  onTabChange(isActive: boolean): void {
    this.updateChartData();
  }

  getListCounts(): any{
    this._dashboardService.listCount(this.username).subscribe((data) => {
      console.log(data)
    });
  }

  getFilteredItems(listId: number): TodoItem[] {
    // console.log(this.allTodoItems.filter(item => item.list_id === listId));
    // console.log(listId)
    return this.allTodoItems.filter(item => item.list_id === listId);
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
      date_created : new Date(), 
      is_deleted : false
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