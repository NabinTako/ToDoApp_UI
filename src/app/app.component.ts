import { Component } from '@angular/core';
import { TasksService } from './Services/tasks.service';
import { Subscription } from 'rxjs';
import { TaskModel } from './Models/TaskModel';
import { AddTaskModel } from './Models/AddTaskModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ToDoApp_UI';

  private getTaskSubscription!: Subscription; 
  private editTaskSubscription?: Subscription; 
  private deleteTaskSubscription?: Subscription; 
  private changeTaskStatusSubscription?: Subscription; 
  private AddTaskSubscription?: Subscription; 

  private tasks: TaskModel[] =[]

  public tasksLeft : TaskModel[] = []
  public tasksDone : TaskModel[] = []
  public taskToEdit: TaskModel;
  public taskToAdd: AddTaskModel;

  public editTask: boolean = false;
  private dialog?: HTMLDialogElement;

  constructor(private taskService: TasksService){ 
    this.taskToEdit={
      id:0,
      name:"",
      completed:false
    };
    this.taskToAdd={
      name:""
    }
  }


  ngOnInit(){
    this.GetTask();
  }

  ngOnDestroy(){
    this.getTaskSubscription.unsubscribe();
    this.editTaskSubscription?.unsubscribe();
    this.deleteTaskSubscription?.unsubscribe();
    this.changeTaskStatusSubscription?.unsubscribe();
    this.AddTaskSubscription?.unsubscribe();
  }

  private GetTask(){
    this.getTaskSubscription = this.taskService.GetTasks().subscribe({
      next: (response) => {
        console.log(response.message);
        this.tasks = response.data;
        this.CalculateTasks();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  public AddTask(){
    this.dialog?.close();
    this.AddTaskSubscription = this.taskService.AddTask(this.taskToAdd).subscribe({
      next: (response) =>{
        console.log(response.message);
        this.GetTask();
      },
      error: (error) => {
        console.log(error);
      }
    })
    this.taskToAdd.name="";
  }

  public EditTask(){
    this.dialog?.close();
    this.editTaskSubscription = this.taskService.EditTask(this.taskToEdit).subscribe({
      next: (response) =>{
        console.log(response.message);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  public DeleteTask(taskId: number){
    this.deleteTaskSubscription = this.taskService.deleteTask(taskId).subscribe({
      next: (response) => {
        console.log(response.message);
        this.taskToEdit = this.tasks.find(t =>  t.id == taskId)!;
        this.tasks.splice(this.tasks.indexOf(this.taskToEdit),1);
        this.CalculateTasks();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  public ChangeTaskStatus(taskId: number){
    this.changeTaskStatusSubscription = this.taskService.ChangeTaskStatus(taskId).subscribe({
      next:(response) =>{
        console.log(response.message);
        this.taskToEdit = this.tasks.find(t =>  t.id == taskId)!;
        this.taskToEdit.completed = !this.taskToEdit.completed;
        this.CalculateTasks();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  
  private CalculateTasks(){
    this.tasksLeft = this.tasks.filter(t=> t.completed == false);
    this.tasksDone = this.tasks.filter(t=> t.completed == true);
  }

  public GetTaskToEdit(taskId?: number){
    this.taskToEdit = this.tasks.find(t =>  t.id == taskId)!;
    if(this.taskToEdit != null){
      this.editTask = true;
      this.OpenDialogModel();
    }
  }

  public OpenDialogModel(){
    if(this.dialog == null){
      this.dialog = <HTMLDialogElement> document.querySelector('#EditOrAddTaskDialog');
    }
    this.dialog.showModal();
  }
  public CloseDialogModel(){
    this.dialog?.close();
    this.taskToAdd.name="";
  }


}

