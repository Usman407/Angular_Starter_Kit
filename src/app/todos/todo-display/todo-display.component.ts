import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StateService } from '../../store/state-service/state.service';
import { TodosActions } from '../../store/todos/todos.actions';
import { Todo } from '../todo';

@Component({
    selector: 'app-todo-display',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './todo-display.component.html'
})

export class DisplayTodoComponent {

    @Input() todo = new Todo();

    constructor(private state: StateService) {}

    edit() {
        this.state.dispatch(new TodosActions.Edit(this.todo.uid));
    }

    delete() {
        if (this.todo.uid) {
            this.state.dispatch(new TodosActions.Delete(this.todo.uid));
        }
    }
}
