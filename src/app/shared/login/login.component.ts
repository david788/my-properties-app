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
  dataLoading: boolean = true;
  brokenNetwork = false;
  // constructor( private _backendservice: BackendService) { }
  constructor(public afAuth: AngularFireAuth, private _router: Router, private _backendservice: BackendService) { }


  ngOnInit(): void {
    // this.userloggedin =true;
    this.getAuthStatus();
  }
  getAuthStatus(){
    this._backendservice.redirectLogin().then(function(result) {
      if (result.credential) {
        window.localStorage.setItem("displayName",result.user.displayName);
        window.localStorage.setItem("email",result.user.email);
        window.localStorage.setItem("picture",result.user.photoURL);
        this.isLoggedIn = true;
      }
    }).catch(
      (err) => {
        this.error = err;
      })
  }
  login(loginType, formData?) {
    this._backendservice.login(loginType, formData);
    /**
    .then(
      (success) => {
        if(formData) {
          window.localStorage.setItem("email",formData.email);
        }
        //console.log(success);
        this._router.navigate(['/settings']);
      }).catch(
      (err) => {
        this.error = err;
      })
    ;
     */
  }

}



