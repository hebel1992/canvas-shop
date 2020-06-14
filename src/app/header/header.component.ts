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
  showSettingsDesktop = false;
  showSettingsMobile = false;

  @ViewChild('desktopSettingsDropdown', {static: true}) desktopSettingsDropdown: ElementRef;
  @ViewChild('mobileSettingsDropdown', {static: true}) mobileSettingsDropdown: ElementRef;
  @ViewChild('mobileNav', {static: true}) mobileNav: ElementRef;

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.desktopSettingsDropdown.nativeElement.contains(event.target) &&
      !this.mobileSettingsDropdown.nativeElement.contains(event.target)) {
      this.showSettingsDesktop = false;
      this.showSettingsMobile = false;
    }
  }

  ngOnInit() {
  }

  onToggleButtonClick() {
    const htmlElement = this.mobileNav.nativeElement as HTMLElement;
    if (!this.mobileNav.nativeElement.classList.contains('show-mobile-nav')) {
      htmlElement.style.display = 'inline-block';
      setTimeout(() => {
        this.showMobileNav = !this.showMobileNav;
      }, 10);
    } else {
      this.showMobileNav = !this.showMobileNav;
      setTimeout(() => {
        htmlElement.style.display = 'none';
      }, 500);
    }
  }

  onMyAccountClickDesktop() {
    this.showSettingsDesktop = !this.showSettingsDesktop;
  }

  onMyAccountClickMobile() {
    this.showSettingsMobile = !this.showSettingsMobile;
  }
}
