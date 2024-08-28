import { TodoItem } from "./mTodoItems";

export class TodoList {
    id: number = 0;
    name: string = "";
    dateCreated: Date = new Date();
    list: TodoItem[] = [];
    userId: number = 0;
}