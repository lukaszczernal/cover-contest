/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./SwiperCard.ts" />

"use strict"

module Swiper {

    export class Deck {
        pile: Array<Card>;
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

        init() {
            var _cards: JQuery = this.elem.find('.swiperImg');
            var _pile: Array<Card> = [];
            var _len: number;

            _cards.each(function() {
                _pile.push(new Card($(this)));
            });
            this.pile = _pile;

            _len = this.pile.length

            this.first = this.pile[_len - 1]
            this.second = this.pile[_len - 2]
            this.third = this.pile[_len - 3]

            this.first.elem.addClass('m-front-1');
            this.second.elem.addClass('m-front-2');
            this.third.elem.addClass('m-front-3');

            this.elem.on('CARD-RATED', (evt: JQueryEventObject) => {
                this.switchCard()
            });
        };

        constructor(public elem: JQuery) {
            this.init();
        }
    };
}