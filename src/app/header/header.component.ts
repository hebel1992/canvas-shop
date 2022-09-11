import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {faFacebook, faInstagram, faSnapchat, faTwitter, faYoutube} from '@fortawesome/free-brands-svg-icons';
import {faCaretDown, faCaretRight, faShoppingCart, faUser} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import {UserService} from '../user/user-service';
import {AuthService} from '../auth/auth.service';
import {BasketItemModel} from '../basket/basket-item.model';
import {BasketService} from '../basket/basket-service';
import {UserDbService} from '../user/user-db-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  faSnapchat = faSnapchat;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faYoutube = faYoutube;
  faUser = faUser;
  faArrowDown = faCaretDown;
  faArrowRight = faCaretRight;
  faShoppingCart = faShoppingCart;

  isAuthenticated = false;
  showMobileNav = false;
  showSettingsDesktop = false;
  showSettingsMobile = false;
  loadingAuthState = false;
  state: string;

  userSubscription: Subscription;
  basketSubscription: Subscription;
  basketAnimationSubscription: Subscription;
  animationActive = false;
  errorMessage = null;
  basket: BasketItemModel[];

  @ViewChild('desktopSettingsDropdown', {static: true}) desktopSettingsDropdown: ElementRef;
  @ViewChild('mobileSettingsDropdown', {static: true}) mobileSettingsDropdown: ElementRef;
  @ViewChild('mobileNav', {static: true}) mobileNav: ElementRef;
  @ViewChild('authStateElement', {static: true}) authStateElement: ElementRef;

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.desktopSettingsDropdown.nativeElement.contains(event.target) &&
      !this.mobileSettingsDropdown.nativeElement.contains(event.target)) {
      this.showSettingsDesktop = false;
      this.showSettingsMobile = false;
    }
  }

  @HostListener('window:resize') updateOrientationState() {
    if (window.innerHeight > window.innerWidth) {
      this.state = 'portrait';
    } else {
      this.state = 'landscape';
    }
  }

  constructor(private userService: UserService,
              private userDbService: UserDbService,
              private authService: AuthService,
              private basketService: BasketService,
              private router: Router) {
  }

  ngOnInit() {
    if (window.innerHeight > window.innerWidth) {
      this.state = 'portrait';
    } else {
      this.state = 'landscape';
    }

    this.loadingAuthState = true;
    const htmlElement = this.authStateElement.nativeElement as HTMLElement;
    htmlElement.style.opacity = '0';

    this.userSubscription = this.userService.userDataChanged.subscribe(userData => {
      if (userData) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
      this.loadingAuthState = false;
      htmlElement.style.opacity = '1';
    });

    this.basketSubscription = this.basketService.basketChanged.subscribe(basket => {
      this.basket = basket;
      this.loadingAuthState = false;
      htmlElement.style.opacity = '1';
    });

    this.basketAnimationSubscription = this.basketService.basketAnimation.subscribe(() => {
      this.animationActive = true;
      setTimeout(() => {
        this.animationActive = false;
      }, 2000);
    });
  }

  onToggleButtonClick() {
    const htmlElement = this.mobileNav.nativeElement as HTMLElement;
    if (!this.mobileNav.nativeElement.classList.contains('show-mobile-nav')) {
      htmlElement.classList.remove('hide-mobile-nav');
      htmlElement.classList.add('display-mobile-nav');
      setTimeout(() => {
        this.showMobileNav = !this.showMobileNav;
      }, 10);
    } else {
      this.showMobileNav = !this.showMobileNav;
      setTimeout(() => {
        htmlElement.classList.remove('display-mobile-nav');
        htmlElement.classList.add('hide-mobile-nav');
      }, 500);
    }
  }

  onMyAccountClickDesktop() {
    this.showSettingsDesktop = !this.showSettingsDesktop;
  }

  onMyAccountClickMobile() {
    this.showSettingsMobile = !this.showSettingsMobile;
  }

  async onLogoutClick() {
    try {
      await this.authService.logout();
      this.closeMobileNavAndRedirect('/gallery');
    } catch (err) {
      this.errorMessage = err.message;
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.basketSubscription.unsubscribe();
    this.basketAnimationSubscription.unsubscribe();
  }

  closeMobileNavAndRedirect(route: string) {
    const htmlElement = this.mobileNav.nativeElement as HTMLElement;
    if (this.mobileNav.nativeElement.classList.contains('show-mobile-nav')) {
      this.showMobileNav = !this.showMobileNav;
      setTimeout(() => {
        htmlElement.classList.remove('display-mobile-nav');
        htmlElement.classList.add('hide-mobile-nav');
      }, 500);
    }
    this.router.navigate([route]).catch(err => {
      this.errorMessage = err.message;
    });
  }
}
