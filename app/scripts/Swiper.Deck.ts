/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Card.ts" />
/// <reference path="./Swiper.Route.ts" />
/// <reference path="./Swiper.Events.ts" />

"use strict"

module Swiper {

    export class Deck extends Ctrl {
        elemQueue:JQuery;
        pile:Array<Card> = [];
        countdown:number;

        endGame() {
            --this.countdown;
            if (this.countdown === 0)
                Route.goto('summary');
        }

        // remove a card if the first on pile is really front one
        // initially all cards have position that is invisible on a rendered pile
        removeFrontCard() {
            if (this.pile[0].isFirst())
                this.pile.shift();
        }

        switchCard() {
            this.removeFrontCard();

            let len:number = this.pile.length;
            let limit:number = (len < Config.pileSize) ? len : Config.pileSize;

            for(let i:number = 0; i<limit; i++) {
                this.pile[i].moveTo(i);
            }
        }

        addCards(cards:CardModel[]) {
            cards.forEach( (cardModel:CardModel) => {
                this.addCard(cardModel);
            });
        }

        addCard(cardModel:CardModel) {
            let card:Card = new Card(this.elemQueue, cardModel, new Swiper.View('card'));
            this.pile.push(card);
            card.setPosition();
            card.draw();
        }

        onGetSuccess(cards:CardModel[]) {
            this.addCards(cards);
        }

        subscribeEvents() {
            Events.subscribe(Events.TYPE.RATE, this.switchCard.bind(this));
            Events.subscribe(Events.TYPE.GET, this.onGetSuccess.bind(this));
            Events.subscribe(Events.TYPE.RATE_END, this.endGame.bind(this));
        }

        init() {
            this.elemQueue = this.elem.find('.swiper-queue');
            this.subscribeEvents();
        };

        activate() {
            this.countdown = this.model.count;
            //TODO improve (once its fetching the date once it just showing it)
            if (this.pile.length) {
                this.switchCard();
            } else {
                this.model.get()
                .then( this.switchCard.bind(this) );
            }
        }

        constructor(parent: JQuery, model: DeckModel, view: View) {
            super(parent, model, view);
            this.draw();
            Route.init('instructions');
        }
    };
}
