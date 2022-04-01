import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Todo } from '@core/models/todo';
import { TodoService } from '@core/service/todo.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit {
  form: FormGroup;

  @Output()
  onDeleteTodo: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  onSaveTodo: EventEmitter<Todo> = new EventEmitter<Todo>();

  constructor(public activeModal: NgbActiveModal, private todoService: TodoService, private fb: FormBuilder) {}

  async ngOnInit() {
    await this.load();
  }

  get todos(): FormArray {
    return this.form.get('todos') as FormArray;
  }

  convertTodo(todo: Todo): FormGroup {
    return new FormGroup({
      id: new FormControl(
        {
          value: todo.id,
          disabled: true,
        },
        [Validators.required]
      ),
      editing: new FormControl(
        {
          value: !todo.id,
          disabled: true,
        },
        []
      ),
      title: new FormControl(
        {
          value: todo.title,
          disabled: !!todo.id,
        },
        [Validators.required]
      ),
      dateCreation: new FormControl(
        {
          value: todo.dateCreation,
          disabled: true,
        },
        [Validators.required]
      ),
      updatedDate: new FormControl(
        {
          value: todo.updatedDate,
          disabled: true,
        },
        [Validators.required]
      ),
      done: new FormControl(
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
    await this.todoService
      .saveOrUpdate({
        title: abstractControl.get('title').value,
        done: abstractControl.get('done').value,
        id: abstractControl.get('id').value,
      })
      .toPromise();
    await this.load();
  }

  async delete(i: number) {
    const abstractControl = this.todos.at(i);
    let id = abstractControl.get('id');
    if (id.value) {
      await this.todoService.delete(id.value).toPromise();
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
    const data = await this.todoService.findAll().toPromise();
    this.form = this.fb.group({
      todos: this.fb.array(data.map(this.convertTodo)),
    });
  }
}
