/// <reference path="../../typings/tsd.d.ts" />

"use strict"

module Swiper {

  export class Config {
    static run() {
      this.setFastClick();
    }

    static setFastClick() {
      $(function() {
        FastClick.attach(document.body);
      });
    }
  }

};
