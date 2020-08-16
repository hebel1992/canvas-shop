import {Component, Input, OnInit} from '@angular/core';
import {PurchaseHistoryItemModel} from '../../purchase-history-item.model';
import {BasketItemModel} from '../../../basket/basket-item.model';
import {ImagesService} from '../../../gallery/images-service';

@Component({
    selector: 'app-shopping-history-item',
    templateUrl: './shopping-history-item.component.html',
    styleUrls: ['./shopping-history-item.component.css']
})
export class ShoppingHistoryItemComponent implements OnInit {
    @Input() historyItem: PurchaseHistoryItemModel;
    images: BasketItemModel[] = [];
    summary = 8;

    constructor(private imageService: ImagesService) {
    }

    ngOnInit(): void {
        this.historyItem.items.forEach(elem => {
            const image = this.imageService.getImage(elem.id);
            this.summary = this.summary + (+elem.quantity * +image.price);
            this.images.push({
                imageId: elem.id,
                price: image.price,
                imageUrl: image.imageUrl,
                quantity: elem.quantity
            });
        });
    }
}
