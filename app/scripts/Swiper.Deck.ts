/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Card.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.Route.ts" />

"use strict"

module Swiper {

    export class Deck extends Ctrl {
        elemQueue: JQuery;
        pile: Array<Card> = [];

        removeFrontCard(): number {
            var ratedCard: Card;
            var len: number;
            ratedCard = Array.prototype.shift.call(this.pile);
            len = this.pile.length;
            ratedCard.elem.on('transitionend', function() {
                ratedCard.elem.remove();
                // @TODO this if should be handled differently ie. trigger end_rate event??
                if (len === 0)
                  Route.goto('summary');
            });
            return len;
        };

        switchCard() {
            var i: number = 0;
            var len: number;
            var limit: number;

            len = this.removeFrontCard();
            limit = (len < 4) ? len : 4;

            // @TODO add method to Card class - move forward (and add register event there)
            while(i < limit) {
                this.pile[i].elem.removeClass('m-front-' + (i+2)).addClass('m-front-' + (i+1));
                i++;
            }

            if (len > 0)
              this.pile[0].registerEvents() //register touch events for the top-most card
        };

        createCards(cards: Array<CardModel>) {
            cards.forEach( (cardModel:CardModel) => {
                var cardCtrl: Card = new Card(this.elemQueue, cardModel, new Swiper.View('card'));
                this.addCard(cardCtrl);
            });
        }

        addCard(card:Card) {
            var index:number = this.pile.push(card);
            if (index < 5) {
                card.elem.addClass('m-front-' + index)
            };

            card.draw(index);
        }

        subscribeEvents() {
            this.model.subscribe('onRATE', () => this.switchCard());
            this.model.subscribe('onGET', (res: Array<CardModel>) => this.createCards(res));
        }

        init() {
            this.elemQueue = this.elem.find('.swiper-queue');
            this.subscribeEvents();
        };

        activate() {
          this.model.get();
        }

        constructor(parent: JQuery, model: DeckModel, view: View) {
            super(parent, model, view);
            this.draw();
        }
    };
}