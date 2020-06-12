import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AboutusComponent } from './shared/aboutus/aboutus.component';
import { CustommaterialModule } from './custommaterial.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings/settings.component';
import { SetproductComponent } from './administrator/setproduct/setproduct.component';
import { AdmintabComponent } from './administrator/admintab/admintab.component';
import { AdmincartsComponent } from './administrator/admincarts/admincarts.component';
import { AdminordersComponent } from './administrator/adminorders/adminorders.component';
import { AdminusersComponent } from './administrator/adminusers/adminusers.component';
import { OrdersComponent } from './user/orders/orders.component';
import { LoginComponent } from './shared/login/login.component';
import { ProductComponent } from './user/product/product.component';
import { UserComponent } from './user/user/user.component';
import { CartsComponent } from './user/carts/carts.component';

//firebase  stuff
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';



import { environment } from '../environments/environment';
import { FileUploadComponent } from './shared/dropzone/fileupload.component';
import { DropZoneDirective } from './shared/dropzone/dropzone.directive';
import { FileSizePipe } from './shared/dropzone/filesize.pipe';
// import { AngularFireAuthModule } from '@angular/fire/auth/auth.module';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutusComponent,
    SettingsComponent,
    SetproductComponent,
    AdmintabComponent,
    AdmincartsComponent,
    AdminordersComponent,
    AdminusersComponent,
    OrdersComponent,
    LoginComponent,
    ProductComponent,
    UserComponent,
    CartsComponent,
    FileUploadComponent,
    DropZoneDirective,
    FileSizePipe

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatSliderModule,
    CustommaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    // AngularFireAuthModule,

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
