import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { LogInActions } from 'app/store/user/logIn/logIn.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { assignDeep } from '../../../helpers';
import { AppState, DefaultAppState } from '../../app.state';
import { StateService } from '../../state-service/state.service';
import { mockStateService } from '../../state-service/state.service.mock';
import { LogInEffects } from './logIn.effects';
import { EmailPasswordCredentials } from 'app/store/user/signUp/signUp.actions';
import { Observable } from 'rxjs/Observable';

describe('log in effects', () => {
    let state: AppState;
    const mockActions$ = new ReplaySubject<Action>(1);
    let logInEffects: LogInEffects;

    class MockAngularFireAuth {
        get auth() {
            return {
                signInWithEmailAndPassword:
                    MockAngularFireAuth.prototype.signInWithEmailAndPassword,
                signOut: MockAngularFireAuth.prototype.signOut,
            };
        }
        signInWithEmailAndPassword() {
            return Promise.resolve('logged in');
        }
        signOut() {
            return Promise.resolve('logged out');
        }
    }

    class MockRouter {
        events = Observable.of();
        navigateByUrl() {}
    }

    beforeEach(() => {
        state = assignDeep(DefaultAppState);
        TestBed.configureTestingModule({
            providers: [
                LogInEffects,
                provideMockActions(() => mockActions$),
                {
                    provide: StateService,
                    useClass: mockStateService(state),
                },
                { provide: AngularFireAuth, useClass: MockAngularFireAuth },
                { provide: Router, useClass: MockRouter },
            ],
        });

        logInEffects = TestBed.get(LogInEffects);
    });

    it('Redirects To Profile On Login Success', done => {
        spyOn(MockRouter.prototype, 'navigateByUrl');
        mockActions$.next(new LogInActions.Success());
        logInEffects.redirectToProfileOnLoginSuccess$.subscribe(result => {
            expect(MockRouter.prototype.navigateByUrl).toHaveBeenCalledWith(
                '/account/profile'
            );
            done();
        });
    });

    it('Redirects to / on logout', done => {
        spyOn(MockRouter.prototype, 'navigateByUrl');
        mockActions$.next(new LogInActions.LogOut());
        logInEffects.logOut$.subscribe(result => {
            expect(MockRouter.prototype.navigateByUrl).toHaveBeenCalledWith(
                '/'
            );
            done();
        });
    });

    it(`Logs in to firebase using the EmailPasswordCredentials signature
        WHEN the action payload mtches that signature`, done => {
        spyOn(
            MockAngularFireAuth.prototype,
            'signInWithEmailAndPassword'
        ).and.callThrough();

        const emailPassword: EmailPasswordCredentials = {
            email: 'email@example.com',
            password: 'password123',
        };

        mockActions$.next(new LogInActions.LogIn(emailPassword));

        logInEffects.logIn$.subscribe(result => {
            expect(
                MockAngularFireAuth.prototype.signInWithEmailAndPassword
            ).toHaveBeenCalledTimes(1);
            expect(
                MockAngularFireAuth.prototype.signInWithEmailAndPassword
            ).toHaveBeenCalledWith(emailPassword.email, emailPassword.password);
            expect(result).toEqual(new LogInActions.Success());
            done();
        });
    });
});
