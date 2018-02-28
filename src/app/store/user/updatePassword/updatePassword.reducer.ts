import { FormReducer } from 'app/store/forms/form.reducer.factory';

import { Messages } from '../../../resources/messages';
import { UpdatePasswordActionTypes } from './updatePassword.actionTypes';

export const UpdatePasswordReducer = FormReducer({
    toggle: UpdatePasswordActionTypes.ToggleForm,
    request: UpdatePasswordActionTypes.Update,
    failure: UpdatePasswordActionTypes.Failure,
    success: UpdatePasswordActionTypes.Success,
    successMessage: Messages.ApiResponse.UpdatePasswordSuccess,
    failureMessage: Messages.ApiResponse.ServerError,
});
