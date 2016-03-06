/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Collection.ts" />
/// <reference path="./Swiper.Card.Model.ts"/>

"use strict"

module Swiper {

  export class DeckModel extends Collection {
      source = 'http://aws-xstream-api-production.xstream.dk/media/videos?limit=10&no_series=true&offset=';
      model = CardModel;
      total = 71; // todo last known count - how to calculate?

      get() {
          return $.ajax(this.source + this.randomOffset())
          .then(this.transform)
          .then(this.emit);
      }

      randomOffset() {
          var limit = 10; // todo this should come from config - related to deal settings
          var pages = Math.floor(this.total / limit);
          var rand = Math.floor(Math.random() * pages) * limit;
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
