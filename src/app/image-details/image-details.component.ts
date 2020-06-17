import {Component, OnInit} from '@angular/core';
import {Image} from '../gallery/image.model';
import {ActivatedRoute} from '@angular/router';
import {ImagesService} from '../gallery/images-service';
import {BasketService} from '../basket/basket-service';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.css']
})
export class ImageDetailsComponent implements OnInit {
  image: Image;
  quantity = 1;
  errorMessage: string;

  constructor(private route: ActivatedRoute,
              private imageService: ImagesService,
              private basketService: BasketService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params.id;
      this.image = this.imageService.getImage(id);
    });
  }

  onAddToBasket() {
    this.basketService.updateBasket(this.image, this.quantity);
  }
}
