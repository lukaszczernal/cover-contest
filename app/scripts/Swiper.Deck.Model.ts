/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Collection.ts" />

"use strict"

module Swiper {

  export class DeckModel extends Collection {
      source = 'data.json';
      model = Swiper.CardModel;
  }

}
