export class TodoItem {
    id: number = 0;
    title: string = "";
    description: string= "";
    dateCreated: Date = new Date();
    dateCompleted?: Date = new Date();
    dateGoal: Date = new Date();
    userId: number = 0;
    listId?: number = 0;
}