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
      let animationPromise = this.elem[0].animate([
        {opacity:1}, {opacity: 0}
      ],{
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards'
      });

      animationPromise.onfinish = () => { this.elem.remove() };
    }

    subscribeEvents() {
      Events.subscribe('onRATEstart', () => this.hide());
    }

    init() {
      this.subscribeEvents();
    }

    constructor(parent: JQuery, model: Model, view: View) {
      super(parent, model, view);
      this.draw();
    }
  }
}
