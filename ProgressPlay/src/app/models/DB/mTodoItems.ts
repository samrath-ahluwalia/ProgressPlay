export class TodoItem {
    id: number = 0;
    title: string = "";
    description: string= "";
    date_created: Date = new Date();
    date_completed?: Date = new Date();
    date_goal: Date = new Date();
    user_id: number = 0;
    list_id?: number = 0;
    is_deleted: boolean = false;
}