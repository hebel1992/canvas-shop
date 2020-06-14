import {Injectable} from '@angular/core';
import {Image} from './image.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private images: Image[] = [];
  imagesChanged = new Subject<Image[]>();

  getImages() {
    return this.images.slice();
  }

  setImages(images: Image[]) {
    this.images = images;
    this.imagesChanged.next(this.images);
  }
}
