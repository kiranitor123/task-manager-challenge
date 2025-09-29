import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Task } from '../../../../../domain/entities/task.entity';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface TaskDialogData {
  task?: Task;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  imports: [
    MatInputModule, 
    ReactiveFormsModule, 
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions]
})
export class TaskFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData,
    private fb: FormBuilder
  ) {
    this.isEditMode = !!data.task;
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data.task) {
      this.form.patchValue({
        title: this.data.task.title,
        description: this.data.task.description
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
