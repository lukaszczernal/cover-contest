/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Home.Model.ts" />
/// <reference path="./Swiper.Deck.ts" />
/// <reference path="./Swiper.Deck.Model.ts" />
/// <reference path="./Swiper.Route.ts" />



module Swiper {

  export class Home extends Ctrl {
    startButton: JQuery;

    startContest() {
      Route.goto('deck');
    }

    registerEvents() {
      this.startButton.on('click', this.startContest);
    }

    loadFirstDeal() {
      this.startButton.text('Loading');
      Route.get('deck').model.get().done( this.onDealLoad.bind(this) );
    }

    onDealLoad() {
      this.registerEvents();
      this.startButton.text('Start');
    }

    init(): Ctrl {
        this.startButton = this.elem.find('.home-start .btn');
        this.loadFirstDeal();
        return this;
    }

    constructor(parent: JQuery, model: HomeModel, view: View) {
        super(parent, model, view);
        this.draw();
    }

  }

}
