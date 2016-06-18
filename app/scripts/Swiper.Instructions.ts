/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.View.ts" />
/// <reference path="./Swiper.Events.ts"/>

"use strict";

module Swiper {

  export class Instructions extends Ctrl {
    hammerElem: HammerManager;

    hide() {
      this.elem.fadeOut(300, () => {
          this.elem.remove();
      });
    }

    subscribeEvents() {
      Events.subscribe('onRATEstart', () => this.hide());
    }

    init(): Ctrl {
      this.subscribeEvents();
      return this;
    }

    constructor(parent: JQuery, model: Model, view: View) {
      super(parent, model, view);
      this.draw();
    }
  }
}
