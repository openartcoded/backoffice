import { Component, OnInit } from '@angular/core';
import { TodoService } from '@core/service/todo.service';
import { Todo } from '@core/models/todo';
import { firstValueFrom, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoFormComponent } from '@feature/user-area/todo-form/todo-form.component';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
    standalone: false
})
export class TodoListComponent implements OnInit {
  isCollapsed: boolean = false;
  todos$: Observable<Todo[]>;

  constructor(private todoService: TodoService, private modalService: NgbModal) {}

  ngOnInit() {
    this.load();
  }

  private load() {
    this.todos$ = this.todoService.findAll();
  }

  openModal() {
    const modalRef = this.modalService.open(TodoFormComponent, { size: 'lg' });
    modalRef.closed.subscribe((value) => {
      this.load();
    });
    modalRef.dismissed.subscribe((value) => {
      this.load();
    });
  }

  async toggleDone(todo: Todo) {
    todo.done = !todo.done;
    await firstValueFrom(this.todoService.saveOrUpdate(todo));
  }
}
