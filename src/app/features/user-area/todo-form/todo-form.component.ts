import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Todo } from '@core/models/todo';
import { TodoService } from '@core/service/todo.service';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastService } from '@core/service/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit {
  form: UntypedFormGroup;

  @Output()
  onDeleteTodo: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  onSaveTodo: EventEmitter<Todo> = new EventEmitter<Todo>();

  constructor(
    public activeModal: NgbActiveModal,
    private todoService: TodoService,
    private toastService: ToastService,
    private fb: UntypedFormBuilder
  ) {}

  async ngOnInit() {
    await this.load();
  }

  get todos(): UntypedFormArray {
    return this.form.get('todos') as UntypedFormArray;
  }

  convertTodo(todo: Todo): UntypedFormGroup {
    return new UntypedFormGroup({
      id: new UntypedFormControl(
        {
          value: todo.id,
          disabled: true,
        },
        [Validators.required]
      ),
      editing: new UntypedFormControl(
        {
          value: !todo.id,
          disabled: true,
        },
        []
      ),
      title: new UntypedFormControl(
        {
          value: todo.title,
          disabled: !!todo.id,
        },
        [Validators.required]
      ),
      dateCreation: new UntypedFormControl(
        {
          value: todo.dateCreation,
          disabled: true,
        },
        [Validators.required]
      ),
      updatedDate: new UntypedFormControl(
        {
          value: todo.updatedDate,
          disabled: true,
        },
        [Validators.required]
      ),
      done: new UntypedFormControl(
        {
          value: todo.done,
          disabled: !!todo.id,
        },
        [Validators.required]
      ),
    });
  }

  add($event: MouseEvent) {
    $event.preventDefault();
    this.todos.push(
      this.convertTodo({
        title: null,
        done: false,
      })
    );
  }

  async save(i: number) {
    const abstractControl = this.todos.at(i);
    const title = abstractControl.get('title').value;
    await firstValueFrom(
      this.todoService.saveOrUpdate({
        title: title,
        done: abstractControl.get('done').value,
        id: abstractControl.get('id').value,
      })
    );
    await this.load();
    this.toastService.showSuccess(`Todo '${title}' saved`);
  }

  async delete(i: number) {
    const abstractControl = this.todos.at(i);
    let id = abstractControl.get('id');
    if (id.value) {
      await firstValueFrom(this.todoService.delete(id.value));
      const title = abstractControl.get('title').value;
      this.toastService.showSuccess(`Todo '${title}' removed`);
    }
    this.todos.removeAt(i);
  }

  edit(i: number) {
    const abstractControl = this.todos.at(i);
    abstractControl.get('editing').patchValue(true);
    abstractControl.get('done').enable();
    abstractControl.get('title').enable();
  }

  private async load() {
    const data = await firstValueFrom(this.todoService.findAll());
    this.form = this.fb.group({
      todos: this.fb.array(data.map(this.convertTodo)),
    });
  }
}
