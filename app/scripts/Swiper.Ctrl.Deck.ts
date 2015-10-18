/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Ctrl.Card.ts" />
/// <reference path="./Swiper.Model.ts" />

"use strict"

module Swiper {

    export class Deck extends Ctrl {
        pile: Array<Card> = [];
        first: Card;
        second: Card;
        third: Card;

        switchCard() {
            var _len: number;

            Array.prototype.pop.call(this.pile);
            _len = this.pile.length;

            this.first.elem.on('transitionend webkitTransitionEnd oTransitionEnd', (evt: JQueryEventObject) => {
                evt.target.parentNode.removeChild(evt.target)
            });

            if (_len > 0) {
                this.first = this.second;
                this.first.elem.removeClass('m-front-2').addClass('m-front-1');
            };

            if (_len > 1) {
                this.second = this.third;
                this.second.elem.removeClass('m-front-3').addClass('m-front-2');
            };

            if (_len > 2) {
                this.third = this.pile[_len - 3];
                this.third.elem.addClass('m-front-3');
            };

            // if (_len == 0)
            //load more cards
        };

        createCards(res: DecksResponse) {
            var cards: Array<DecksCardResponse> = res.data;
            cards.forEach( (card:DecksCardResponse) => {
                this.pile.push(new Card(card));
            });
        }

        locateCards() {
            // _len = this.pile.length

            // this.first = this.pile[_len - 1]
            // this.second = this.pile[_len - 2]
            // this.third = this.pile[_len - 3]

            // this.first.elem.addClass('m-front-1');
            // this.second.elem.addClass('m-front-2');
            // this.third.elem.addClass('m-front-3');
            return 'locateCards'
        }

        subscribeEvents() {
            // this.elem.on('CARD-RATED', (evt: JQueryEventObject) => {
            //     this.switchCard()
            // });
            return 'subscribe to Cards events'
        }

        init() {
            this.model.getAll()
                .done((res) => this.createCards(res))
                .done(() => this.locateCards())
                .done(() => this.subscribeEvents());
        };

        constructor(elem:JQuery, model:Cards, view:DeckView) {
            super(elem, model, view);
            this.init();
        }
    };
}