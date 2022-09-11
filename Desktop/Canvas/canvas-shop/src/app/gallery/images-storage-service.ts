import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, tap} from 'rxjs/operators';
import {Image} from './image.model';
import {ImagesService} from './images-service';

@Injectable({
  providedIn: 'root'
})
export class ImagesStorageService {

  constructor(private db: AngularFirestore,
              private imageService: ImagesService) {
  }

  fetchImages() {
    return this.db.collection('images').get().pipe(map(images => {
      const imagesArray = [];
      images.docs.forEach(data => {
        const imageToFetch = new Image(
          data.data().id,
          data.data().url,
          data.data().price
        );
        imagesArray.push(imageToFetch);
      });
      return imagesArray;
    }), tap(images => {
      this.imageService.setImages(images);
    })).toPromise<Image[]>();
  }
}
