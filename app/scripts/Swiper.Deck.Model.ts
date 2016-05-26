/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Collection.ts" />
/// <reference path="./Swiper.Card.Model.ts"/>

"use strict"

module Swiper {

  export class DeckModel extends Collection {
      model:CardModel;
      total:number = 64; // todo last known count - how to calculate?
      count:number = 10;

      source():string {
          return `http://aws-xstream-api-production.xstream.dk/media/videos?limit=${this.count}&no_series=true&offset=${this.randomOffset()}`
      };

      get() {
          return $.ajax(this.source())
          .then(this.transform)
          .then(this.emit);
      }

      randomOffset() {
          let pages = Math.floor(this.total / this.count);
          let rand = Math.floor(Math.random() * pages) * this.count;
          return rand;
      }

      transformImage(images) {
          var len: number = images.length;
          while(len--) {
            var img: any = images[len].format['a-iPad-DVD-x2'];
            if (img) {
              return img.source;
            }
          };
          return 'images/no-image.jpg';
      }

      transformCard(card: any): CardResponse {
          return {
            id: card.id,
            src: this.transformImage(card.images),
            title: card.titles.default
          };
      }

      transform = (data: any)  => {
          var cards: CardModel[] = [];
          data.media.forEach((media: any) => {
              var card: CardResponse = this.transformCard(media);
              cards.push(new CardModel(card));
          });
          this.total = data.count;
          this.collection = _.shuffle(cards);
      }
  }
}
