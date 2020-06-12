import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BackendService } from 'src/app/services/backend.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.css']
})
export class AdminusersComponent implements OnInit {
  items = [];
  title = 'angular9-firebaseapp';

  employee: any;
  employeeName:string;
  employeeAge:number;
  employeeAddress:string;
  message:string;

  takeHostSelfie = false;
  showHostSelfie = false;
  myDocId; 
  profileUrl: Observable<string | null>;


  constructor(private db: AngularFirestore, public crudservice:BackendService, private _backendService: BackendService, private _storage: AngularFireStorage) { }

  ListData: MatTableDataSource<any>

  ngOnInit(): void {
    // this.db.collection('items').snapshotChanges().subscribe(

    //   serverItems => {
    //     this.items = [];
    //     serverItems.forEach(a => {
    //       let item: any = a.payload.doc.data();
    //       item.id = a.payload.doc.id;
    //       this.items.push(item);
    //     });
    //   }
    // );
    this.crudservice.get_Allemployee().subscribe(data => {

      this.employee = data.map(e => {
        return {
          id: e.payload.doc.id,
          isedit: false,
          name: e.payload.doc.data()['name'],
          age: e.payload.doc.data()['age'],
          address: e.payload.doc.data()['address'],
        };
      })
      console.log(this.employee);

    });
    
  }

  CreateRecord()
  {
    let Record = {};
    Record['name'] = this.employeeName;
    Record['age'] = this.employeeAge;
    Record['address'] = this.employeeAddress;

    this.crudservice.create_Newemployee(Record).then(res => {

        this.employeeName = "";
        this.employeeAge = undefined;
        this.employeeAddress ="";
        console.log(res);
        this.message = "Employee data save Done";
    }).catch(error => {
      console.log(error);
    });
    
  }
  EditRecord(Record)
  {
    Record.isedit = true;
    Record.editname = Record.name;
    Record.editage = Record.age;
    Record.editaddress = Record.address;

  }

  Updatarecord(recorddata)
  {
    let record = {};
    record['name'] = recorddata.editname;
    record['age'] = recorddata.editage;
    record['address'] = recorddata.editaddress;
    this.crudservice.update_employee(recorddata.id, record);
    recorddata.isedit = false;
  }

  Deleteemployee(record_id)
  {
    this.crudservice.delete_employee(record_id);
  }

  getPic(picId) { 
    const ref = this._storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
  }
  deleteProductPic(docId){
    if (confirm("Are you sure want to delete this picture ?")) {
    this._backendService.deleteProductPic('product',docId);
    }
}
//another

  add() {
    this.db.collection('items').add({
      category:"Bucky",
    });
  }
  update(item){
    this.db.doc('items/${item.id}').update({
      category: new Date(),
    });
  }
  delete(item){
    this.db.doc('items/${item.id}').delete();
  }

}
