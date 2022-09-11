import {Component, Input, OnInit} from '@angular/core';
import {Image} from '../image.model';

@Component({
  selector: 'app-gallery-image',
  templateUrl: './gallery-image.component.html',
  styleUrls: ['./gallery-image.component.css']
})
export class GalleryImageComponent implements OnInit {
  @Input() image: Image;

  constructor() {
  }

  ngOnInit(): void {
  }

}
