import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageModel} from '../../image-details/image.model';
import {ImagesService} from '../../gallery/images-service';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.css']
})
export class BasketItemComponent implements OnInit {
  @Input() imageId: string;
  @Input() quantity: number;

  @Output() quantityChanged = new EventEmitter<number>();
  @Output() itemDeleted = new EventEmitter();

  image: ImageModel;
  faBin = faTrashAlt;

  constructor(private imageService: ImagesService) {
  }

  ngOnInit(): void {
    this.image = this.imageService.getImage(this.imageId);
  }

  onIncreaseQuantity() {
    this.quantity++;
    this.quantityChanged.emit(1);
  }

  onDecreaseQuantity() {
    if (this.quantity <= 1) {
      return;
    }
    this.quantity--;
    this.quantityChanged.emit(-1);
  }

  onDelete() {
    this.itemDeleted.emit();
  }
}
