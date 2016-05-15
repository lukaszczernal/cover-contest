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

    draw() {
        this.parent.empty();
        super.draw();
    }

    //TODO find out a way not to re-attache events
    activate() {
        this.model.update();
        this.render();
        this.draw();
        this.elemGoToDeck = this.parent.find('.summary-controlsBtn.goToDeck');;
        this.elemGoToHome = this.parent.find('.summary-controlsBtn.goToHome');
        this.subscribeEvents();
    }

    init() {};

  }

}
