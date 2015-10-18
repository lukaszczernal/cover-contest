/// <reference path="../../typings/tsd.d.ts" />
"use strict"

module Swiper {

  export class Card {
      elem: JQuery;
      hammer: HammerManager;
      newTranslateX: number;
      translateX: number;
      translateY: number;
      rotate: number;

      transform() {
          var transformations: string[] = [];
          transformations.push("translateX(" + this.newTranslateX + "px)");
          transformations.push("translateY(" + this.translateY + "px)");
          transformations.push("rotate(" + this.rotate + "deg)");
          this.elem.css('transform', transformations.join(' '));
      };

      registerEvents() {
          this.hammer.on("panstart", () => {
              this.elem.removeClass('tween');
          });

          this.hammer.on("panleft panright", (evt: HammerInput) => {
              var degMax: number = 10;
              var deltaMax: number = 200;

              this.newTranslateX = this.translateX + evt.deltaX;
              this.rotate = (Math.abs(evt.deltaX) < deltaMax) ? evt.deltaX / deltaMax * degMax : Math.sign(this.newTranslateX) * degMax;

              this.transform();
          });

          this.hammer.on("panend", (evt: HammerInput) => {
              this.elem.addClass('tween');
              var apex: number = 180
              var distance: number = this.newTranslateX - this.translateX;

              if (Math.abs(distance) > apex) {
                  this.rotate = (distance > 0) ? 30 : -30;
                  this.translateX = this.translateX + distance;
                  this.translateX = this.translateX + distance;
                  this.elem.trigger('CARD-RATED');
              } else {
                  this.rotate = 0;
              }
              this.newTranslateX = this.translateX;
              this.transform();
          });
      };

      updatePosition() {
          this.translateY = parseInt(this.elem.css('transform').split(',')[5], 10);
          this.translateX = parseInt(this.elem.css('transform').split(',')[4], 10);
          this.newTranslateX = this.translateX;
          this.rotate = 0;
      };

      init() {
          this.hammer = new Hammer(this.elem[0]);
          this.elem.on('transitionend webkitTransitionEnd oTransitionEnd', () => {
              this.updatePosition();
          });
          this.updatePosition()
          this.registerEvents();
      };

      constructor(public source:DecksCardResponse) {
          // if (elem[0].width > 0 && elem[0].height > 0) {
          //     this.init()
          // } else {
          //     elem.load(() => {
          //         this.init()
          //     })
          // }
      };
  };
}