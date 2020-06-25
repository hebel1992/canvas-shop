import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GalleryComponent} from './gallery/gallery.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {GalleryResolverService} from './gallery/gallery-resolver.service';
import {ImageDetailsComponent} from './image-details/image-details.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {CanDeactivateGuard} from './user/can-deactivate-guard.service';
import {BasketComponent} from './basket/basket.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {CanActivateGuardService} from './user/can-activate-guard.service';
import {CheckoutComponent} from './checkout/checkout.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/gallery', pathMatch: 'full'},
  {path: 'gallery', component: GalleryComponent, resolve: [GalleryResolverService]},
  {path: 'gallery/:id', component: ImageDetailsComponent, resolve: [GalleryResolverService]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'profile', component: UserProfileComponent, canDeactivate: [CanDeactivateGuard], canActivate: [CanActivateGuardService]},
  {path: 'basket', component: BasketComponent, resolve: [GalleryResolverService]},
  {path: 'checkout', component: CheckoutComponent, resolve: [GalleryResolverService]},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
