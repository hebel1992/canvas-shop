export class Image {
  public id: string;
  public imageUrl: string;
  public price: number;

  constructor(id: string, imageUrl: string, price: number) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.price = price;
  }

  setId(id: string) {
    this.id = id;
  }
}
