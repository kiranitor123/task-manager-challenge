import { Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';

import { AuthPresenter } from '../../../presenters/auth.presenter';
import { TaskPresenter } from '../../../presenters/task.presenter';
import { TaskItemComponent } from '../../../components/task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form/task-form.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { Task } from '../../../../domain/entities/task.entity';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    TaskItemComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  constructor(
    protected authPresenter: AuthPresenter,
    protected taskPresenter: TaskPresenter,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const currentUser = this.authPresenter.currentUser();
    
    if (currentUser) {
      this.taskPresenter.loadTasks(currentUser.id).subscribe();
    }
  }


  openTaskForm(task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const currentUser = this.authPresenter.currentUser();
        if (!currentUser) return;

        if (task) {
          this.taskPresenter.updateTask({
            taskId: task.id,
            userId: currentUser.id,
            title: result.title,
            description: result.description
          }).subscribe();
        } else {
          this.taskPresenter.createTask({
            userId: currentUser.id,
            title: result.title,
            description: result.description
          }).subscribe();
        }
      }
    });
  }

  onToggleTask(taskId: string): void {
    this.taskPresenter.toggleTask(taskId).subscribe();
  }

  onEditTask(task: Task): void {
    this.openTaskForm(task);
  }

  onDeleteTask(taskId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      const currentUser = this.authPresenter.currentUser();
      if (!currentUser) return;

      if (result) {
        this.taskPresenter.deleteTask(taskId, currentUser.id).subscribe();
      }
    });
  }

  logout(): void {
    this.authPresenter.logout();
  }
}