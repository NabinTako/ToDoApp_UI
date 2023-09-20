import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from 'src/environment';
import { TaskModel } from '../Models/TaskModel';
import { AddTaskModel } from '../Models/AddTaskModel';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  // API URLS>>>>>>>>>>>
  private getTasksUrl = "Tasks/get";
  private editTaskUrl = "Tasks/edit";
  private deleteTaskUrl = "Tasks/delete";
  private addTaskUrl = "Tasks/add";
  private changeTaskStatusUrl = "Tasks/changestatus";
  // _______________________________________________

  constructor(private http: HttpClient) { }

  public GetTasks(): Observable<any>{
    return this.http.get(`${environments.apiUrl}/${this.getTasksUrl}`);
  }

  public EditTask(taskToEdit:TaskModel): Observable<any>{
    return this.http.post(`${environments.apiUrl}/${this.editTaskUrl}`,taskToEdit);
  }

  public deleteTask(taskId: number): Observable<any>{
    return this.http.delete(`${environments.apiUrl}/${this.deleteTaskUrl}/${taskId}`);
  }

  public AddTask(task: AddTaskModel): Observable<any>{
    return this.http.post(`${environments.apiUrl}/${this.addTaskUrl}`,task);
  }

  public ChangeTaskStatus(taskId:number): Observable<any>{
    return this.http.post(`${environments.apiUrl}/${this.changeTaskStatusUrl}/${taskId}`,"");
  }

}
