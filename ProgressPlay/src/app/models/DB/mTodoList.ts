import { TodoItem } from "./mTodoItems";

export class TodoList {
    id: number = 0;
    name: string = "";
    date_created: Date = new Date();
    list: TodoItem[] = [];
    user_id: number = 0;
}