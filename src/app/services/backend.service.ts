import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  auth: any;

  constructor(public afAuth: AngularFireAuth) { }

  login(loginType, formData?) {
    if (formData) {
        return this.afAuth.signInWithEmailAndPassword(formData.email, formData.password);
    } else {
        let loginMethod;
        if (loginType == 'FB') { loginMethod = new firebase.auth.FacebookAuthProvider(); }
        if (loginType == 'GOOGLE') { loginMethod = new firebase.auth.GoogleAuthProvider() }

        return this.afAuth.signInWithRedirect(loginMethod)
    }
}
  logout() {
    this.auth.signOut();
  }
  redirectLogin() {
    return this.afAuth.getRedirectResult();
}

  getProducts(collType){
    let fakeresponse = [{
      'category': "test",
       'scategory': "Tesm",
        'name': "Shirt",
         'price':"\$32",
          '_id': "123",
          
    }];
    return Observable.create(
      observer=>{
        setTimeout(() =>{
          observer.next(fakeresponse)
        }, 2000)
      }
    )
  }
  getFilterProducts(collType, filters){
    let fakeresponse = [{
      'category': "test",
       'scategory': "Team",
        'name': "Shirt",
         'price':"\$32",
          '_id': "123",
          
    }];
    return Observable.create(
      observer=>{
        setTimeout(() =>{
          observer.next(fakeresponse)
        }, 2000)
      }
    )
  }
  setProducts(collType, products){
    let fakeresponse = true;
    return Observable.create(
      observer =>{
        setTimeout(() =>{
          observer.next(fakeresponse)
        }, 2000)
      }
    )
  }
  updateProducts(collType, products){
    let fakeresponse = true;
    return Observable.create(
      observer =>{
        setTimeout(() =>{
          observer.next(fakeresponse)
        }, 2000)
      }
    )
  }
  getOneProductId(collType,docId){
    let fakeresponse = {
      'category': "test",
       'scategory': "Team",
        'name': "Shirt",
         'price':"\$32",
          '_id': "123",
          
    };
    return Observable.create(
      observer=>{
        setTimeout(() =>{
          observer.next(fakeresponse)
        }, 2000)
      }
    )
  }
  delOneProductId(collType, docId){
    let fakeresponse = true;
    return Observable.create(
      observer =>{
        setTimeout(() =>{
          observer.next(fakeresponse)
        }, 2000)
      }
    )
  }
  updateShoppingInterest(collType, data){
    let fakeresponse = true;
    return Observable.create(
      observer =>{
        setTimeout(() =>{
          observer.next(fakeresponse)
        }, 2000)
      }
    )
  }
  updateShoppingCart(collType, data){
    let fakeresponse = true;
    return Observable.create(
      observer =>{
        setTimeout(() =>{
          observer.next(fakeresponse)
        }, 2000)
      }
    )
  }

}
