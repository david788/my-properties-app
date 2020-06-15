import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutusComponent } from './shared/aboutus/aboutus.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SettingsComponent } from './settings/settings/settings.component';
import { AdmintabComponent } from './administrator/admintab/admintab.component';
import { ProductComponent } from './user/product/product.component';
import { LoginComponent } from './shared/login/login.component';
import { UserComponent } from './user/user/user.component';
import { AuthGuardAdminService } from './services/auth-guard-admin.service';
import { AuthGuardService } from './services/auth-guard.service';
import { OrdersComponent } from './user/orders/orders.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'footer', component: FooterComponent },
  // { path: 'admin', component:AdmintabComponent , canActivate:[AuthGuardAdminService] },
  { path: 'admin', component: AdmintabComponent, },

  { path: 'product', component: ProductComponent, },
  // { path: 'product', component: ProductComponent,canActivate:[AuthGuardService] },

  // { path: 'settings', component: SettingsComponent,  canActivate:[AuthGuardService] },
  { path: 'settings', component: SettingsComponent, },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: UserComponent },
  { path: 'orders', component: OrdersComponent },



  { path: '**', redirectTo: '/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
