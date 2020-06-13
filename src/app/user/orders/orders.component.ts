import {Component, ViewChild, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BackendService } from 'src/app/services/backend.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs/Rx';

// import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  // displayedColumns = ['ROLLNO','category', 'CLS', 'STD_NM', 'FATH_NM', 'PERCENT'];
  displayedColumns = ['category', 'scategory', 'name', 'price', '_id'];

  //dataSource: MatTableDataSource<any>;
  dataSource = new MatTableDataSource();
  // members;
  profileUrl: Observable<string | null>;

  members: any[];
  // dataSource: MatTableDataSource<any>;
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

  takeHostSelfie = false;
  showHostSelfie = false;
  myDocId;



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _dataService: BackendService, private _storage: AngularFireStorage) { }

  ngOnInit() {
    //return this._dataService.getData().subscribe(res => this.dataSource.data = res["0"]["data"]);
    return this._dataService.getDocsNew().subscribe(res => this.dataSource.data = res);
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
  getPic(picId) { 
    const ref = this._storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
  }
  deleteProductPic(docId){
    if (confirm("Are you sure want to delete this picture ?")) {
    this._dataService.deleteProductPic(docId);
    }
    
}
getDoc(docId) {
  this.dataLoading = true;
  this.querySubscription = this._dataService.getProduct( docId)
    .subscribe(res => {
      if (res) {
        this.myDocData = res;
        // this.toggle('editMode');
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
deleteDoc(docId) {
  if (confirm("Are you sure you want to delete this record ?")) {
    this.dataLoading = true;
    this.querySubscription = this._dataService.delOneProductId('product', docId)
      .subscribe(res => {
        if (res) {
          this.myDocData = res;
          // this.toggle('searchMode');
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
}

}
