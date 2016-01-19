"use strict"

declare var FastClick: any;

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
