import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UpdateEmailActions } from 'app/store/user/updateEmail/updateEmail.actions';

import { FormComponent } from '../../helpers/form.component';
import { StateService } from '../../store/state-service/state.service';
import { emailValid } from '../../validators';

@Component({
    selector: 'app-account-update-email',
    templateUrl: './update-email.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEmailComponent extends FormComponent implements OnInit {
    controlNames = {
        newEmail: 'newEmail',
    };

    formState$ = this.state.select(s => s.user.updateEmail);

    constructor(private state: StateService, private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            [this.controlNames.newEmail]: ['', emailValid],
        });
    }

    updateEmail() {
        this.state.dispatch(
            new UpdateEmailActions.Update(
                this.getFormValue(this.controlNames.newEmail)
            )
        );
    }
}
