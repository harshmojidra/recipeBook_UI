import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error:string = null;

  constructor(private authService: AuthService,private router : Router) { }

  ngOnInit(): void {
    this.error =null;
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {

    if (!authForm.valid) {
      return;
    }

    this.isLoading =true;
    const email = authForm.value.email;
    const pass = authForm.value.password;

    let authObs : Observable<AuthResponseData>;

    console.log('email : ' +email + "  Password : "+pass);
    
    if (this.isLoginMode) {
      console.log("Login...");
      
      authObs = this.authService.login(email, pass);
    }
    else {
      authObs= this.authService.signUp(email, pass);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.error = null;
        this.isLoading=false;
        this.router.navigate(['/recipes']);
        
      }, errorMsg => {
        console.log(errorMsg);
        this.error = errorMsg ;
        this.isLoading=false;
      }
    );

    authForm.reset();
  }


  onHandleError() {
    this.error = null;
  }
}
