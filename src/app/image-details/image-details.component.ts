import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Image} from '../gallery/image.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ImagesService} from '../gallery/images-service';
import {BasketService} from '../basket/basket-service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.css']
})
export class ImageDetailsComponent implements OnInit {
  image: Image;
  quantity = 1;
  errorMessage: string;
  fullScreenHorizontalImage = false;
  fullScreenVerticalImage = false;
  displayBackdrop = false;
  innerWidth: number;
  imageOrientation: string;

  @ViewChild('backdrop', {static: true}) backdrop: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private imageService: ImagesService,
              private basketService: BasketService,
              private snackBar: MatSnackBar) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.route.params.subscribe(params => {
      const id = params.id;
      this.image = this.imageService.getImage(id);
    });
  }

  async onAddToBasket() {
    this.errorMessage = null;
    const isNotNumber = isNaN(Number(this.quantity));
    if (!this.quantity || isNotNumber || this.quantity < 1) {
      window.scrollTo(0, 0);
      this.errorMessage = 'Please put a valid number larger than 0';
      return;
    }
    try {
      await this.basketService.updateBasket(this.image, this.quantity);
    } catch (err) {
      window.scrollTo(0, 0);
      this.errorMessage = err;
    }
    this.snackBar.open('Product added to basket!', 'Dismiss', {
      duration: 3000
    });
  }

  onImageClick(img: HTMLImageElement) {
    if (this.innerWidth > 1280) {
      if (!this.displayBackdrop) {
        img.style.zIndex = '11';
        this.displayBackdrop = !this.displayBackdrop;
        setTimeout(() => {
          if (this.imageOrientation === 'horizontal') {
            this.fullScreenHorizontalImage = !this.fullScreenHorizontalImage;
          } else {
            this.fullScreenVerticalImage = !this.fullScreenVerticalImage;
          }
        }, 10);
      } else {
        if (this.imageOrientation === 'horizontal') {
          this.fullScreenHorizontalImage = !this.fullScreenHorizontalImage;
        } else {
          this.fullScreenVerticalImage = !this.fullScreenVerticalImage;
        }
        setTimeout(() => {
          img.style.zIndex = 'unset';
          this.displayBackdrop = !this.displayBackdrop;
        }, 300);
      }
    }
  }

  async singlePurchase() {
    const isNotNumber = isNaN(Number(this.quantity));
    if (!this.quantity || isNotNumber || this.quantity < 1) {
      window.scrollTo(0, 0);
      this.errorMessage = 'Please put a valid number larger than 0';
      return;
    }
    await this.router.navigate(['/checkout'], {
      queryParams:
        {
          purchaseType: 'single',
          imageId: this.image.id,
          quantity: this.quantity
        }
    });
  }

  onImageLoaded(img: HTMLImageElement) {
    if (img.offsetWidth > img.offsetHeight) {
      this.imageOrientation = 'horizontal';
    } else {
      this.imageOrientation = 'vertical';
    }
  }
}
