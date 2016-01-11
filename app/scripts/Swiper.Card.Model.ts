/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.Deck.Model.ts" />

"use strict"

module Swiper {

  export class CardModel extends Model {
      EVENTS: any = {
          'RATE': 'onRATE'
      };
      rate(card: CardResponse, grade: number) {
          this.publish(this.EVENTS.RATE);
      }

      constructor(data: CardResponse, model: Swiper.DeckModel) {
          super(data, model)
      }
  }

}
