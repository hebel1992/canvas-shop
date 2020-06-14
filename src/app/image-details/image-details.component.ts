import {Component, OnInit} from '@angular/core';
import {Image} from '../gallery/image.model';
import {ActivatedRoute} from '@angular/router';
import {ImagesService} from '../gallery/images-service';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.css']
})
export class ImageDetailsComponent implements OnInit {
  image: Image;

  constructor(private route: ActivatedRoute,
              private imageService: ImagesService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params.id;
      this.image = this.imageService.getImage(id);
    });
  }

}
