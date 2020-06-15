import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BackendService } from 'src/app/services/backend.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-setproduct',
  templateUrl: './setproduct.component.html',
  styleUrls: ['./setproduct.component.css']
})
export class SetproductComponent implements OnInit, OnDestroy {
  members: any[];
  dataSource: MatTableDataSource<any>;
  myDocData;
  data;
  currentDate;
  currentDate7;
  toggleField: string;
  state: string = '';
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  private querySubscription;

  profileUrl: Observable<string | null>;
  takeHostSelfie = false;
  showHostSelfie = false;
  myDocId;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //the documents to be read from firebase and be displayed on the mat table
  displayedColumns = ['category', 'scategory', 'name', 'price', '_id'];
  constructor(private _backendService: BackendService, private _storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.toggleField = "searchMode";
    this.dataSource = new MatTableDataSource(this.members);
    this.currentDate = new Date();
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.currentDate7 = new Date();
    this.currentDate7.setDate(this.currentDate.getDate() - 7);
  }
  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  toggle(filter?) {
    if (!filter) { filter = "searchMode" }
    else { filter = filter; }
    this.toggleField = filter;
  }
  //fetch data from firebase database
  getData() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getDocsNew('product')
      .subscribe(members => {
        this.members = members;
        this.dataSource = new MatTableDataSource(members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.dataLoading=false;

      }, (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
        () => { this.error = false; this.dataLoading = false; });
  }

  getFilterData(filters) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getFilterProducts('product', filters)
      .subscribe(members => {
        this.members = members;
        this.dataSource = new MatTableDataSource(members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLoading = false;

      }, (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
        () => { this.error = false; this.dataLoading = false; });
  }

  setData(formData) {
    this.dataLoading = true;
    //was setNewDoc
    this._backendService.setNewDoc('product', formData).then((res) => {
      this.dataLoading = false;

      this.savedChanges = true;
    }).catch(error => {
      this.error = true;
      this.errorMessage = error.message;
      this.dataLoading = false;
    });
  }

  updateData(formData) {
    formData.tags = formData.tags.split(',');
    if (confirm("Are you sure want to update this record ?")) {
      this.dataLoading = true;
      this._backendService.updateProduct('product', formData).then((res) => {
        this.error = false;
        this.errorMessage = "";
        this.dataLoading = false;
        this.savedChanges = true;
      }).catch(error => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      });
    }
  }
  //pic functions
  getPic(picId) {
    const ref = this._storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
  }
  deleteProductPic(docId) {
    if (confirm("Are you sure want to delete this picture ?")) {
      this._backendService.deleteProductPic(docId);
    }
  }
  getDoc(docId) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getProduct(docId)
      .subscribe(res => {
        if (res) {
          this.myDocData = res;
          this.toggle('editMode');
          this.dataLoading = false;


        }
      }, (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
        () => { this.error = false; this.dataLoading = false; }
      );
  }
  // deleteDoc(docId) {
  //   if (confirm("Are you sure you want to delete this record ?")) {
  //     this.dataLoading = true;
  //     this.querySubscription = this._backendService.delOneProductId('product', docId)
  //       .subscribe(res => {
  //         if (res) {
  //           this.myDocData = res;
  //           this.toggle('searchMode');
  //           this.dataLoading=false;
  //         }
  //       }, (error) => {
  //         this.error = true;
  //         this.errorMessage = error.message;
  //         this.dataLoading = false;
  //       },
  //         () => { this.error = false; this.dataLoading = false; }
  //       );
  //   }
  // }
  deleteDoc(record_id) {
    if (confirm("Are you sure you want to delete this record ?")) {
      this.dataLoading = true;
      this._backendService.deleteOneProduct(record_id);
      this.toggle('searchMode');
      this.dataLoading = false;
    }
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}
