
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-admincarts',
  templateUrl: './admincarts.component.html',
  styleUrls: ['./admincarts.component.css']
})
export class AdmincartsComponent implements OnInit, OnDestroy {
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['category', 'scategory', 'name', 'price', '_id'];
  constructor(private _backendService: BackendService) { }

  ngOnInit(): void {
    this.toggleField = "seachMode";
    this.dataSource = new MatTableDataSource(this.members);
    this.currentDate = new Date();
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.currentDate7 = new Date();
    this.currentDate7.setDate(this.currentDate.getDate() - 7);
  }
  toggle(filter?) {
    if (!filter) { filter = "searchMode" }
    else { filter = filter; }
    this.toggleField = filter;
  }
  getData() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getProducts('cart')
      .subscribe(members => {
        this.members = members;
        this.dataSource = new MatTableDataSource(members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLoading=false;

      }, (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
        () => { this.error = false; this.dataLoading = false; });
  }
  getFilterData(filters) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getFilterProducts('cart', filters)
      .subscribe(members => {
        this.members = members;
        this.dataSource = new MatTableDataSource(members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLoading=false;

      }, (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
        () => { this.error = false; this.dataLoading = false; });
  }
  setData(formData) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getProducts('cart', )
      .subscribe(members => {
        if (members) {
          this.savedChanges = true;
          this.dataLoading=false;

        }
      }, (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
        () => { this.error = false; this.dataLoading = false; }
      );
  }
  updateData(formData) {
    formData.tags = formData.tags.split(',');
    if (confirm("Are you sure want to update this record ?")) {
        this.dataLoading = true;
        this._backendService.updateProduct('cart', formData).then((res) => {
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
  // updateData(formData) {
  //   this.dataLoading = true;
  //   this.querySubscription = this._backendService.updateProduct('cart', formData)
  //     .subscribe(members => {
  //       if (members) {
  //         this.savedChanges = true;
  //         this.dataLoading=false;

  //       }
  //     }, (error) => {
  //       this.error = true;
  //       this.errorMessage = error.message;
  //       this.dataLoading = false;
  //     },
  //       () => { this.error = false; this.dataLoading = false; }
  //     );
  // }
  getPic(picId) { }
  deleteProductPic(docId) { }
  getDoc(docId) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getDoc( docId)
      .subscribe(res => {
        if (res) {
          this.myDocData = res;
          this.toggle('editMode');
          this.dataLoading=false;


        }
      }, (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
        () => { this.error = false; this.dataLoading = false; }
      );
  }
  
  deleteDoc(record_id) {
    if (confirm("Are you sure you want to delete this record ?")) {
      this.dataLoading = true;
      this._backendService.deleteOneProduct(record_id);
      this.dataLoading = false;
    }
  }
  ngAfterViewInit() { }
  applyFilter(filterValue: string) { }
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}

