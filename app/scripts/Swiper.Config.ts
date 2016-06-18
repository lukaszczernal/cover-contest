/// <reference path="../../typings/tsd.d.ts" />

"use strict"

module Swiper {

  export class Config {

    static run() {
      this.setFastClick();
      this.animateCss();
    }

    static setFastClick() {
      $(function() {
        FastClick.attach(document.body);
      });
    }

    static animateCss() {
        $.fn.extend({
            animateCss: function (animationName: string) {
                let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                    $(this).removeClass('animated ' + animationName);
                });
            }
        });
    }

    static pileSize = 3;

  }

};
