import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryImageComponent } from './gallery/gallery-image/gallery-image.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {AppRoutingModule} from './app-routing.module';
import { ImageDetailsComponent } from './image-details/image-details.component';
import {MaterialModule} from './material/material.module';
import { LoginComponent } from './auth/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RegisterComponent } from './auth/register/register.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import {FormsModule} from '@angular/forms';
import { AuthAwaitSpinnerComponent } from './shared/auth-await-spinner/auth-await-spinner.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    GalleryComponent,
    GalleryImageComponent,
    PageNotFoundComponent,
    ImageDetailsComponent,
    LoginComponent,
    RegisterComponent,
    LoadingSpinnerComponent,
    AuthAwaitSpinnerComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
