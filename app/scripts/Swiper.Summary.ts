/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Route.ts" />

"use strict"

module Swiper {

  export class Summary extends Ctrl {
    elemGoToDeck: JQuery;
    elemGoToHome: JQuery;

    goToDeck() {
      Route.goto('deck');
    }

    goToHome() {
      Route.goto('home');
    }

    subscribeEvents() {
      this.elemGoToDeck.click(this.goToDeck);
      this.elemGoToHome.click(this.goToHome);
    }

    init() {
      this.draw();
      this.elemGoToDeck = this.parent.find('.summary-goToDeck');
      this.elemGoToHome = this.parent.find('.summary-goToHome');
      this.subscribeEvents();
    };

  }

}
