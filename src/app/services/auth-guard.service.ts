// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { BackendService } from './backend.service';


// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService  {

//   constructor (private _backendservice: BackendService, private _router: Router) { }
//   async canActivate(): Promise<boolean> {
//       const authenticatedUser = await this._backendservice.getUser();
//       const authenticated = !!authenticatedUser;
//       if (!authenticated) {
//         this._router.navigate(['/login']);
//       }
//       return authenticated;
//     }
// }

import { CanActivate, Router } from '@angular/router';
//import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Injectable } from "@angular/core";
// import { Observable } from "rxjs";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public afAuth: AngularFireAuth, private router: Router) { }

  canActivate(): Observable<boolean> {
    return Observable.from(this.afAuth.authState)
      .take(1)
      .map(state => !!state)
      .do(authenticated => {
        if
      (!authenticated) this.router.navigate(['/login']);
      })
  }
}
