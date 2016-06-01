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
                .then(this.transform.bind(this))
                .then(this.store.bind(this))
                .then(this.preload)
                .done(this.emit);
        }

      randomOffset() {
          let pages = Math.floor(this.total / this.count);
          let rand = Math.floor(Math.random() * pages) * this.count;
          return rand;
      }

        preload(cards) {
            let def = $.Deferred();
            let timeout = setTimeout(def.resolve, 5000);
            let len = cards.length;

            cards.forEach(preloadImage);

            function preloadImage(card) {
                let img = new Image();
                img.src = card.src;
                img.onload = onload;
            };

            function onload() {
                if (--len == 0) {
                    clearTimeout(timeout);
                    def.resolve();
                }
            }
            return def.promise();
        }

        store(cards) {
            this.total = cards.count;
            this.collection = cards;
            return cards;
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

      transform(data: any) {
          var cards: CardModel[] = [];
          data.media.forEach((media: any) => {
              var card: CardResponse = this.transformCard(media);
              cards.push(new CardModel(card));
          });
          return _.shuffle(cards);
      }
  }
}
