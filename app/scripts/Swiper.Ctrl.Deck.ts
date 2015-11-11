/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Ctrl.Card.ts" />
/// <reference path="./Swiper.Model.ts" />

"use strict"

module Swiper {

    export class Deck extends Ctrl {
        elemQueue: JQuery;
        pile: Array<Card> = [];

        removeFrontCard() {
            var ratedCard: Card;
            ratedCard = Array.prototype.shift.call(this.pile);
            ratedCard.elem.on('transitionend', function() {
                ratedCard.elem.remove()
            });
        }

        switchCard() {
            var i: number = 0;
            var len: number;
            var limit: number = (len < 4) ? len : 4;

            this.removeFrontCard();

            len = this.pile.length;

            while(i < limit) {
                this.pile[i].elem.removeClass('m-front-' + (i+2)).addClass('m-front-' + (i+1));
                i++;
            }

            if (this.pile.length < (limit + 1))
                this.model.get();
        };

        createCards(cards: Array<Cards>) {
            cards.forEach( (cardModel:Cards) => {
                var cardCtrl: Card = new Card(this.elemQueue, cardModel, new Swiper.CardView())
                this.addCard(cardCtrl);
            });
        }

        addCard(card:Card) {
            var index:number = this.pile.push(card);
            if (index < 5) {
                card.elem.addClass('m-front-' + index)
            };

            card.draw();
        }

        subscribeEvents() {
            this.model.subscribe('onRATE', () => this.switchCard());
            this.model.subscribe('onGET', (res: Array<Cards>) => this.createCards(res));
        }

        init() {
            this.elemQueue = this.elem.find('.swiper-queue');
            this.subscribeEvents();
            this.model.get();
        };

        constructor(parent: JQuery, model: CardsCollection, view: DeckView) {
            super(parent, model, view);
            this.draw();
        }
    };
}
