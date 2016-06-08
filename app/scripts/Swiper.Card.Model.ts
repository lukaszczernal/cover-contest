/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Events.ts"/>
/// <reference path="./Swiper.Deck.Model.ts" />

"use strict"

module Swiper {

    export class CardModel {
        id:number = null;
        src:string = null;
        title:string = null;
        userRating:number = 0;
        rating:number = Math.floor(Math.random() * 100) + 0; //TODO get real data  

        rate(direction:number) {
          this.userRating = direction;
          Events.publish(Events.TYPE.RATE);
        }

        constructor(data:CardResponse) {
          this.id = data.id;
          this.src = data.src;
          this.title = data.title;
        }
    }
}
