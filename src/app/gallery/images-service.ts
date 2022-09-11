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

  getImage(id: string) {
    for (const image of this.images) {
      if (image.id === id) {
        return image;
      }
    }
  }

  setImages(images: Image[]) {
    this.images = images;
    this.imagesChanged.next(this.images);
  }
}
