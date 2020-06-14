import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GalleryComponent} from './gallery/gallery.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ImagesResolverService} from './gallery/images-resolver.service';
import {ImageDetailsComponent} from './image-details/image-details.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/gallery', pathMatch: 'full'},
  {path: 'gallery', component: GalleryComponent, resolve: [ImagesResolverService]},
  {path: 'gallery/:id', component: ImageDetailsComponent, resolve: [ImagesResolverService]},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
