"use strict"

module Swiper {

  export class Summary extends Ctrl {
    elemGoToDeck: JQuery;

    goToDeck() {
      Route.goto('deck');
    }

    subscribeEvents() {
      this.elemGoToDeck.click(this.goToDeck);
    }

    draw(): Ctrl {
        this.parent.empty();
        return super.draw();
    }

    animate(type: string): Ctrl {
        this.elem.animateCss(type); //TODO add typing
        return this;
    }
    //TODO find out a way not to re-attache events
    activate(): Ctrl {
        this.model.update();
        this.render();
        this.draw();
        this.elemGoToDeck = this.parent.find('.summary-controlsBtn.goToDeck');
        this.subscribeEvents();
        return this;
    }

  }

}
