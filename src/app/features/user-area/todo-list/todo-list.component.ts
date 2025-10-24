import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '@core/service/todo.service';
import { Todo } from '@core/models/todo';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '@core/service/toast.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: false,
})
export class TodoListComponent implements OnInit {
  todos: Todo[];
  isAdding = false;
  newTodoForm: FormGroup;

  constructor(
    private toastService: ToastService,
    private todoService: TodoService,
    private fb: FormBuilder,
  ) {}

  @HostListener('document:keydown', ['$event'])
  topKey(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      event.stopPropagation();
      this.isAdding = !this.isAdding;
    }
  }
  ngOnInit() {
    this.load();
    this.newTodoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  private load() {
    this.todoService.findAll().subscribe((todos) => (this.todos = todos));
  }

  toggleAddMode() {
    this.isAdding = !this.isAdding;
    this.newTodoForm.reset();
  }

  async saveNewTodo() {
    if (this.newTodoForm.invalid) return;

    const newTodo: Todo = {
      title: this.newTodoForm.value.title.trim(),
      done: false,
    };

    const savedTodo = await firstValueFrom(this.todoService.saveOrUpdate(newTodo));
    this.todos.push(savedTodo);
    this.isAdding = false;
    this.toastService.showSuccess('todo saved');
    this.newTodoForm.reset();
  }

  async toggleDone(todo: Todo) {
    todo.done = !todo.done;
    await firstValueFrom(this.todoService.saveOrUpdate(todo));
    this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
    this.load();
  }
}
