import { Component, ViewChild } from '@angular/core';
import {Nav, Platform, LoadingController, MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

//import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { AboutPage } from "../pages/about/about";
import { RadioPage } from "../pages/radio/radio";
import { ContactUsPage } from "../pages/contact-us/contact-us";
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { SplashHomePage } from "../pages/splash-home/splash-home";

import { SiteDataProvider } from "../providers/site-data/site-data";
import { NetworkAuthProvider } from "../providers/network-auth/network-auth";
import { UserAuthProvider } from "../providers/user-auth/user-auth";
import { AuthenticateService } from "../services/authenticate-service";


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SplashHomePage; // by default any is = HomePage; - using LoginPage for Authenticating page
  loader: any;
  siteName = this.siteData.siteName;
  appVersion = this.siteData.appVersion;
  pushHomePage = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private menuCtrl: MenuController,
              public loadingCtrl: LoadingController,
              public siteData: SiteDataProvider,
              public networkAuth: NetworkAuthProvider,
              private userAuth: UserAuthProvider,
              private authService: AuthenticateService
              /*
              public modalCtrl: ModalController,
              public secureStorage: Storage*/
             ) {
    firebase.initializeApp({
      apiKey: "AIzaSyDNkbko2E9nLq2P652SER5Wyyz4wrJffh0",
      authDomain: "hgmradio-86b55.firebaseapp.com",
    });
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home', component: HomePage},
      {title: 'About', component: AboutPage},
      {title: 'Radio', component: RadioPage},
      {title: 'Register', component: RegisterPage},
      {title: 'Login', component: LoginPage},
      {title: 'Contact', component: ContactUsPage}
    ];

    // call loading controller for app authentication
    this.presentLoading();

    // 1. network connection
    this.networkAuth.checkNetworkConnection();

    // 2. check if user login information is present
    this.userAuth.login().then((isLoggedIn) => {

      if (isLoggedIn === true) {
        this.rootPage = RadioPage;
      } else {
          this.rootPage = LoginPage;
      }
      this.loader.dismiss();
    });

    // 2. get user local info service provider


  }

  /**
   * show Authenticating loader
   */
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Authenticating App..."
    });
    this.loader.present();
  }

  // if not a register member, show not a register member loader
  notARegisterMember() {
    this.loader = this.loadingCtrl.create({
      content: "Please Register"
    })
  }

  onLogOut(){
      this.authService.signOut();
      this.menuCtrl.close();
  }

  initializeApp() {
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from inside InitialApp function', readySource);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
