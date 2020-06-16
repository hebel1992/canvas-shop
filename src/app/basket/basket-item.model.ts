export class BasketItemModel {
  imageId: string;
  price: number;
  imageUrl: string;
  quantity: number;

  constructor(imageId: string, price: number, imageUrl: string, quantity: number) {
    this.imageId = imageId;
    this.quantity = quantity;
    this.price = price;
    this.imageUrl = imageUrl;
  }
}
