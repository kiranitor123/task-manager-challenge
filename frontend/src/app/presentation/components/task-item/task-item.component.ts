import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../../domain/entities/task.entity';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [MatCardModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
  }
}