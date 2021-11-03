import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}


@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User>(null);
    tokenExpireTimer : any;

    constructor(private http: HttpClient, private route: Router) { }

    signUp(email: string, pass: string) {
        return this.http.post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyACCoR-RDr1uYtUF5Vy_30JXNYO8-_h1vE",
            // "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[AIzaSyACCoR-RDr1uYtUF5Vy_30JXNYO8-_h1vE]"
            {
                email: email,
                password: pass,
                returnSecureToken: true
            }
        )
            .pipe(
                catchError(this.errorHandler), tap(resdata => {
                    this.handleAuthenticateUser(resdata.email, resdata.localId, resdata.idToken, +resdata.expiresIn);
                }));
    }

    login(email: string, pass: string) {
        return this.http.post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyACCoR-RDr1uYtUF5Vy_30JXNYO8-_h1vE",
            {
                email: email,
                password: pass,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.errorHandler), tap(resdata => {
                this.handleAuthenticateUser(resdata.email, resdata.localId, resdata.idToken, +resdata.expiresIn);
            }));
    }



    private handleAuthenticateUser(email: string, userId: string, token: string, expireIn: number) {
        const expdate = new Date(new Date().getTime() + expireIn * 1000);
        const user = new User(email, userId, token, expdate);
        this.user.next(user);
        this.autoLogout(expireIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));

    }

    private errorHandler(errorRes: HttpErrorResponse) {
        let error = 'An unknown error occured '!
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(error);
        }

        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                error = 'This Email exist';
                break;
            case 'EMAIL_NOT_FOUND':
                error = 'This Email is not exist';
                break;
            case 'INVALID_PASSWORD':
                error = 'Invalid password';
                break;
        }
        return throwError(error);
    }

    logout() {
        this.user.next(null);
        this.route.navigate(['/auth']);
        localStorage.removeItem('usetData');

        if(this.tokenExpireTimer){
            clearTimeout(this.tokenExpireTimer);
        }

        this.tokenExpireTimer=null;
    }

    autoLogout(expirationDuration : number){
        this.tokenExpireTimer = setTimeout(()=>{
            this.logout();
        },expirationDuration)
    }

    autoLogin() {
        const user: {
            email: string, id: string, _token: string, _tokenExpDate: number
        } = JSON.parse(localStorage.getItem('userData'));

        if (!user) {
            return null;
        }

        const loadedUser = new User(user.email,user.id,user._token,new Date(user._tokenExpDate));

        if(loadedUser.token){
            this.user.next(loadedUser);
            const expDuration = new Date(user._tokenExpDate).getTime() - new Date().getTime();
            this.autoLogout(expDuration);
        }
    }

}