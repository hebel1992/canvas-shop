import {Component, OnInit} from '@angular/core';
import {ImagesStorageService} from './images-storage-service';
import {Image} from './image.model';
import {ImagesService} from './images-service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  images: Image[];

  constructor(private imagesStorageService: ImagesStorageService,
              private imageService: ImagesService) {
  }

  ngOnInit(): void {
    this.images = this.imageService.getImages();
  }
}
