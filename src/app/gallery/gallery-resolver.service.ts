import {Injectable} from '@angular/core';
import {ImagesStorageService} from './images-storage-service';
import {ImagesService} from './images-service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Image} from './image.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryResolverService implements Resolve<Image[]> {
  constructor(private imagesStorageService: ImagesStorageService,
              private imageService: ImagesService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Image[]> | Promise<Image[]> | Image[] {
    const images = this.imageService.getImages();

    if (images.length === 0) {
      return this.imagesStorageService.fetchImages();
    } else {
      return images;
    }
  }
}
