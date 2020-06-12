import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from 'src/app/services/backend.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  members: Observable<any>;
  items = [];
  dataSource: MatTableDataSource<any>;
  myDocData;
  data;
  currentDate;
  currentDate7;
  toggle: boolean = true;
  state: string = '';
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  private querySubscription;

  profileUrl: Observable<string | null>;
  // profileUrl: String;
  takeHostSelfie = false;
  showHostSelfie = false;
  myDocId;
  
  counter = 0;
  constructor(private db: AngularFirestore ,private _backendService: BackendService, private _storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getData();
    // this.db.collection('product').snapshotChanges().subscribe(

    //   serverItems => {
    //     this.items = [];
    //     serverItems.forEach(a => {
    //       let item: any = a.payload.doc.data();
    //       item.id = a.payload.doc.id;
    //       this.items.push(item);
    //     });
    //   }
    // );
  }
 
  getData() {
    this.members = this._backendService.getProducts('product');
  }
  getFilterData(filters) {
    if (filters) {
      this.members = this._backendService.getFilterProducts('product', filters);
    } else {
      this.getData();
    }
  }
  setData(formData) {
    this.dataLoading = true;
    this._backendService.setProduct('product', formData).then((res) => {
        this.savedChanges = true;
        this.dataLoading = false;
    }).catch(error => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
    });
}
  getPic(picId) {
    const ref = this._storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
  }
  showDetails(item) {
    this.counter = 0;
    this.myDocData = item;
    this.getPic(item.path);
    // capture user interest event, user has looked into product details
    this.dataLoading = true;
    let data = item;
    return this._backendService.updateShoppingInterest('interests', data).then((success) => {
      this.dataLoading = false;
    });
  }
  countProd(filter) {
    if (filter == "add") {
      this.counter = this.counter + 1;
    } else {
      if (this.counter > 0) {
        this.counter = this.counter - 1;
      }
    }
  }
  addToCart(item, counter) {
    this.dataLoading = true;
    let data = item;
    data.qty = counter;
    return this._backendService.updateShoppingCart('cart', data).then((success) => {
      this.dataLoading = false;
      this.counter = 0;
      this.savedChanges = true;
    });
  }
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
   // getData() {
  //   this.dataLoading = true;
  //   this.querySubscription = this._backendService.getProducts('product')
  //     .subscribe(members => {
  //       this.members = members;

  //       this.dataLoading = false;

  //     }, (error) => {
  //       this.error = true;
  //       this.errorMessage = error.message;
  //       this.dataLoading = false;
  //     },
  //       () => { this.error = false; this.dataLoading = false; });
  // }
  // getFilterData(filters) {
  //   this.dataLoading = true;
  //   this.querySubscription = this._backendService.getFilterProducts('product', filters)
  //     .subscribe(members => {
  //       this.members = members;
  //       this.dataLoading = false;

  //     }, (error) => {
  //       this.error = true;
  //       this.errorMessage = error.message;
  //       this.dataLoading = false;
  //     },
  //       () => { this.error = false; this.dataLoading = false; });
  // }
  // getPic(picId) {
  //   this.profileUrl = "";
  // }
  // showDetails(item) {
  //   this.counter = 0;
  //   this.myDocData = item;
  //   this.getPic(item.path);
  //   // capture user interest event, user has looked into product details
  //   this.dataLoading = true;
  //   let data = item;
  //   this.querySubscription = this._backendService.updateShoppingInterest('interests', data)
  //     .subscribe(members => {
  //       this.members = members;
  //       this.dataLoading = false;

  //     }, (error) => {
  //       this.error = true;
  //       this.errorMessage = error.message;
  //       this.dataLoading = false;
  //     },
  //       () => { this.error = false; this.dataLoading = false; });

  // }
  // addToCart(item, counter) {
  //   this.dataLoading = true;
  //   let data = item;
  //   data.qty = counter;
  //   this.querySubscription = this._backendService.updateShoppingCart('cart', data)
  //     .subscribe(members => {
  //       this.members = members;
  //       this.dataLoading = false;

  //     }, (error) => {
  //       this.error = true;
  //       this.errorMessage = error.message;
  //       this.dataLoading = false;
  //     },
  //       () => { this.error = false; this.dataLoading = false; });

  // }

  // countProd(filter) {
  //   if (filter == "add") {
  //     this.counter = this.counter + 1;
  //   } else {
  //     if (this.counter > 0) {
  //       this.counter = this.counter - 1;
  //     }
  //   }
  // }

  // addToCart(item, counter) {
  //   this.dataLoading = true;
  //   let data = item;
  //   data.qty = counter;
  //   return this._backendService.updateShoppingCart('cart', data).then((success) => {
  //     this.dataLoading = false;
  //     this.counter = 0;
  //     this.savedChanges = true;
  //   });
  // }
  // showDetails(item) {
  //   this.counter = 0;
  //   this.myDocData = item;
  //   this.getPic(item.path);
  //   // capture user interest event, user has looked into product details
  //   this.dataLoading = true;
  //   let data = item;
  //   return this._backendService.updateShoppingInterest('interests', data).then((success) => {
  //     this.dataLoading = false;
  //   });
  // }
}
