import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  state: string = '';
  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;
  savedChanges = false;
  constructor(private _backendService: BackendService, private router: Router) {
  }
  //this takes user back to login page
  routeLoginPage() {
    this.router.navigate(['/login']);
  }


 //signing up function for the new user function declared here
  onSubmit(formData) {
    this.dataLoading = true;
    this._backendService.createUser(formData).then(
      (success) => {
        this.dataLoading = false;
        this.savedChanges = true;
      },
      (error) => {
        this.error = error;
        this.dataLoading = false;
        this.savedChanges = false;
      }
    )
  }
}
