import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {faFacebook, faInstagram, faSnapchat, faTwitter, faYoutube} from '@fortawesome/free-brands-svg-icons';
import {faShoppingCart, faSortDown, faUser} from '@fortawesome/free-solid-svg-icons';

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
  faArrowDown = faSortDown;
  faShoppingCart = faShoppingCart;

  isAuthenticated = true;
  showMobileNav = false;
  showSettings = false;

  @ViewChild('settingsDropdown', {static: true}) settingsDropdown: ElementRef;

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.settingsDropdown.nativeElement.contains(event.target)) {
      this.showSettings = false;
    }
  }

  ngOnInit(): void {}

  onToggleButtonClick() {
    this.showMobileNav = !this.showMobileNav;
  }

  onMyAccountClick() {
    this.showSettings = !this.showSettings;
  }
}
