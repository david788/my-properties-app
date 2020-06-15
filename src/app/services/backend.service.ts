import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, } from 'rxjs/Rx';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { switchMap, take } from 'rxjs/operators';
// import {combineLatest } from 'rxjs';


import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Item } from './data.type';

// import { AngularFirestore } from '@angular/fire/firestore/firestore';
// import { AngularFirestoreDocument } from '@angular/fire/firestore/public_api';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  auth: any;
  private itemsCollection: AngularFirestoreCollection<any>;
  private itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;
  authState: any = null;
  private _eStoreColl: string = "onlinestore";


  // items = [];
  items$: Observable<Item[]>;
  nameFilter$: BehaviorSubject<string | null>;
  rollNoFilter$: BehaviorSubject<string | null>;
  private _firebaseCollURL = "product";
  items: Observable<any>;


  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, public fireservices: AngularFirestore) {
    this.afAuth.authState.subscribe(authState => {
      this.authState = authState;
    });
  }
  //amit new


  getDocsByName(STD_NM: string | null) {
    this.nameFilter$.next(STD_NM);
    return this.items$
  }
  getDocsByRollNo(ROLLNO: string | null) {
    this.rollNoFilter$.next(ROLLNO);
    return this.items$
  }

  //end

  create_Newemployee(Record) {
    return this.fireservices.collection('Employee').add(Record);
  }

  get_Allemployee() {
    return this.fireservices.collection('Employee').snapshotChanges();
  }
  getProductsNew() {
    return this.fireservices.collection('product').snapshotChanges();

  }

  update_employee(recordid, record) {
    this.fireservices.doc('Employee/' + recordid).update(record);
  }

  delete_employee(record_id) {
    this.fireservices.doc('Employee/' + record_id).delete();
  }

  //the function to create a new user is called here
  createUser(formData) {
    if (environment.database == 'firebase') {
      return this.afAuth.createUserWithEmailAndPassword(formData.value.email, formData.value.password);
    }

  }

  //login function  called here according to the type of login the user has chosen
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

  //logout function  called here
  logout() {
    //  return this.auth.signOut();
    return this.afAuth.signOut();
  }
  //this checks whether user is logged in or not
  isUserLoggedIn(): Observable<boolean> {
    return Observable.from(this.afAuth.authState)
      .take(1)
      .map(state => !!state)
      .do(authenticated => {
        return authenticated;
      });
  }

  //for redirecting after goiong to google account
  redirectLogin() {
    return this.afAuth.getRedirectResult();
  }
  getUser(): Promise<any> {
    return this.afAuth.authState.pipe(take(1)).toPromise();
  }
  // isUserAdmin() {
  //   let collUrl = !this.isUserLoggedIn() ? "abcd" : this.auth.currentuser.uid;
  //   collUrl = "onlinestore/dstech/admins" + collUrl;
  //   return this.getDoc(collUrl);
  // }

  // getDoc(collUrl: string) {
  //   this.itemDoc = this.afs.doc<any>(collUrl);
  //   return this.itemDoc.valueChanges();
  // }


  get timestamp() {
    var d = new Date();
    return d;
  }

  //CRUD starts here
  //set new  product  function to database

  //CREATE
  setProduct(coll: string, formData: any, docId?: string) {
    // coll = this._eStoreColl + "/" + localStorage.getItem('center') + "/" + coll;
    return this.setNewDoc(coll, formData);
  }
  setNewDoc(coll: string, data: any, docId?: any) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp
    var docRef = this.afs.collection(coll).doc(item.id);
    return docRef.set({
      ...data,
      _id: id,
      updatedAt: timestamp,
      createdAt: timestamp,
      delete_flag: "N",
      // authid: this.authState.currentuser.uid,
      username: this.authState.displayName,
      useremail: this.authState.email
    });
  }
  //the function to upload a pic for a single document
  setProductPic(filePath, coll, docId?) {
    var docRef = this.afs.collection('product').doc(docId);
    return docRef.set({
      path: filePath
    }, { merge: true });
  }

  //READ

  //function to get a single document
  getProduct(docId: string) {
    return this.getDoc(docId);
  }
  getDoc(docId: string) {
    return this.afs.collection('product').doc(docId).valueChanges();
  }
  //function to get collection documents and display on a table
  getDocsNew(filters?: any) {
    this.nameFilter$ = new BehaviorSubject(null);
    this.rollNoFilter$ = new BehaviorSubject(null);

    return this.items$ = Observable.combineLatest(
      this.nameFilter$,
      this.rollNoFilter$
    ).switchMap(
      ([STD_NM, ROLLNO]) =>
        this.afs.collection<Item>(this._firebaseCollURL, ref => {
          let query = ref.where('delete_flag', '==', 'N');
          if (STD_NM) { query = ref.where('STD_NM', '>=', STD_NM); query = query.orderBy('STD_NM', 'desc'); };
          if (ROLLNO) { query = ref.where('ROLLNO', '>=', ROLLNO); query = query.orderBy('ROLLNO', 'desc'); };
          return query;
        }).valueChanges()
    );
  }

  //function to retrieve collection documents for products page
  getProducts(coll: string, filters?: any) {
    this.itemsCollection = this.afs.collection<any>('product');
    return this.itemsCollection.valueChanges();

  }

  //get orders for a specific user
  getCart(coll: string) {
    return this.afs.collection('orders', ref =>
      ref.where('delete_flag', '==', 'N')
        .where('author', '==', this.authState.uid)
        .orderBy('name', 'desc')
    ).valueChanges();
    // .snapshotChanges().map(actions => {
    //     return actions.map(a => {
    //         const data = a.payload.doc.data();
    //         const id = a.payload.doc.id;
    //         return { id, ...data };
    //     });
    // });
  }
  getCollectionUrl(filter) {
    // return "onlinestore/dstech/"+filter;
    return this.fireservices.collection('products').snapshotChanges() + filter;

    // return "/products/" + filter;


  }
  // getCollectionURL(filter){
  //   return this.afs.collection('products').snapshotChanges().subscribe(

  //     serverItems => {
  //       this.items = [];
  //       serverItems.forEach(a => {
  //         let item: any = a.payload.doc.data();
  //         item.id = a.payload.doc.id;
  //         this.items.push(item);
  //       });
  //     }
  //   );
  // }

  // getDocsa(coll: string, filters?: any) {
  //   if (filters) {
  //     if (filters.name > "") {
  //       return this.afs.collection(coll, ref =>
  //         ref.where('name', '>=', filters.name)
  //           .where('delete_flag', '==', 'N')
  //           .orderBy('name', 'desc')
  //       ).valueChanges();

  //     }
  //     if (filters.category > "") {
  //       return this.afs.collection(coll, ref =>
  //         ref.where('category', '>=', filters.category)
  //           .where('delete_flag', '==', 'N')
  //           .orderBy('category', 'desc')
  //       ).valueChanges();

  //     } else {
  //       let fromDt = new Date(filters.fromdt);
  //       let toDt = new Date(filters.todt);
  //       return this.afs.collection(coll, ref =>
  //         ref.where('updatedAt', '>=', fromDt)
  //           .where('updatedAt', '<', toDt)
  //           .where('delete_flag', '==', 'N')
  //           .orderBy('updatedAt', 'desc')
  //       ).valueChanges();

  //     }
  //   } else {
  //     return this.afs.collection(coll, ref =>
  //       ref.where('delete_flag', '==', 'N')
  //         .orderBy('name')
  //         .orderBy('updatedAt', "desc"))
  //       .valueChanges();

  //   }
  // }


  //orderby requires firebase indexing
  // getProducts(coll: string) {
  //   return this.afs.collection('product', ref =>
  //     ref.where('delete_flag', '==', 'N')
  //       .orderBy('name', 'desc')
  //   ).valueChanges();

  // }


  getFilterProducts(coll: string, filters) {
    return this.afs.collection("product", ref =>
      ref.where('delete_flag', '==', 'N')
        .where('tags', 'array-contains', filters)
        .orderBy('tags', 'desc')
    ).valueChanges();

  }


  //UPDATE

  //function to update a record
  updateProduct(coll, formData) {
    return this.updateDoc("product", formData._id, formData);
  }
  updateDoc(coll: string, docId: string, data: any) {
    const timestamp = this.timestamp
    var docRef = this.afs.collection(coll).doc(docId);
    return docRef.update({
      ...data,
      updatedAt: timestamp,
      delete_flag: "N",
      username: this.authState.displayName,
      useremail: this.authState.email
    });
  }

  //place the order
  updateShoppingCart(coll: string, data) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp
    var docRef = this.afs.collection('orders').doc(item.id);
    return docRef.set({
      ...data,
      //author: this.afAuth.currentUser.uid,
      author: this.authState.uid,
      // authorName: this.afAuth.currentUser.displayName,
      // authorEmail: this.afAuth.currentUser.email,
      // authorPhoto: this.afAuth.currentUser.photoURL,
      // authorPhone: this.afAuth.currentUser.phoneNumber,
      authorName: this.authState.displayName,
      authorEmail: this.authState.email,
      // authorPhoto: this.authState.photoURL,
      // authorPhone: this.authState.phoneNumber,
      updatedAt: timestamp,
      createdAt: timestamp,
      delete_flag: "N",
    });
  }

  //store interests to firestore
  updateShoppingInterest(coll: string, data) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp
    var docRef = this.afs.collection('interests').doc(item.id);
    return docRef.set({
      ...data,
      author: this.authState.uid,
      authorName: this.authState.displayName,
      authorEmail: this.authState.email,
      authorPhoto: this.authState.photoURL,
      authorPhone: this.authState.phoneNumber,
      updatedAt: timestamp,
      createdAt: timestamp,
      delete_flag: "N",
    });
  }


  //DELETE

  deleteOneProduct(record_id) {
    this.fireservices.doc('product/' + record_id).delete();
  }

  //the function to delete the picture of a single document
  deleteProductPic(record_id) {
    this.fireservices.doc('product/' + record_id).set({
      path: null
    }, { merge: true });
  }

  //CRUD ENDS
}
