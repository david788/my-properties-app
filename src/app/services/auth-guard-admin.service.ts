import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BackendService } from './backend.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


// import { take, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService implements CanActivate{

  constructor(private router: Router) { }
  canActivate() {
    if(localStorage.getItem('token') == "7PjNil") {
       return true;
    } else {
       this.router.navigate(['/login']);
       return false;
   }
}

// constructor(private _backendservice: BackendService){}
// canActivate():Observable<boolean>{
//   return this._backendservice.isUserAdmin()
//   .take(1)
//   .map(res =>{
//     if(res){
//       return res.isadmin;
//     }
//     else{
//       return false;
//     }
//   }).do(isadmin => {
//     console.log(isadmin)
//     return true;
//   })
  
// }
}
