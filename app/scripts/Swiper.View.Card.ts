/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.View.ts" />

"use strict"

declare var CC: any;

module Swiper {

  export class CardView extends View {
      templateName = 'card';

      constructor() {
          super()
      }
  }
}
