import {Component, OnInit} from '@angular/core';
import {Image} from '../gallery/image.model';
import {ActivatedRoute} from '@angular/router';
import {ImagesService} from '../gallery/images-service';
import {BasketService} from '../basket/basket-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.css']
})
export class ImageDetailsComponent implements OnInit {
  image: Image;
  quantity = 1;
  errorMessage: string;
  fullScreenImage = false;

  constructor(private route: ActivatedRoute,
              private imageService: ImagesService,
              private basketService: BasketService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params.id;
      this.image = this.imageService.getImage(id);
    });
  }

  onAddToBasket() {
    this.basketService.updateBasket(this.image, this.quantity);
    this.snackBar.open('Product added to basket!', 'Dismiss', {
      duration: 3000
    });
  }

  onImageClick() {
    this.fullScreenImage = !this.fullScreenImage;
  }
}
