import {Component, OnInit} from '@angular/core';
import {faFacebook, faInstagram, faSnapchat, faTwitter, faYoutube} from '@fortawesome/free-brands-svg-icons';
import {faShoppingCart, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faSnapchat = faSnapchat;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faYoutube = faYoutube;

  faUser = faUser;
  faShoppingCart = faShoppingCart;
  showMobileNav = false;
  isAuthenticated = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  onToggleButtonClick() {
    this.showMobileNav = !this.showMobileNav;
  }
}
