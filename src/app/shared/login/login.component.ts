import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userloggedin: boolean = true;
  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;
  constructor(public afAuth: AngularFireAuth, private _router: Router, private _backendservice: BackendService) { }


  ngOnInit(): void {
    // this.userloggedin =true;
    this.getAuthStatus();
  }

//login function declared here
  login(loginType, formData?) {
    this.dataLoading=true;
    this._backendservice.login(loginType, formData);
  
  }
  //logout function declared here
  logout() {
    this.dataLoading = true;
    return this._backendservice.logout().then((success) => {
      this.userloggedin = false;
      this.dataLoading = false;
    })
  }
  //authstatus gotten here
  getAuthStatus() {
    this._backendservice.redirectLogin().then(function (result) {
      if (result.credential) {
        window.localStorage.setItem("displayName", result.user.displayName);
        window.localStorage.setItem("email", result.user.email);
        window.localStorage.setItem("picture", result.user.photoURL);
        this.isLoggedIn = true;
      }
    }).catch(
      (err) => {
        this.error = err;
      })
  }

}



