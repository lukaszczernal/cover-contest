/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.View.Deck.ts" />
/// <reference path="./Swiper.Ctrl.Deck.ts" />

"use strict"

// declare var CC: any;
module App {

  export init() {
    var elem = $('#deckUI');
    var model = new Swiper.CardsCollection();
    var view = new Swiper.DeckView();

    new Swiper.Deck(elem, model, view);
  }

};
    //
    // function switchScene(stageID: string, template: string, callback: Function) {
    //   var stage: JQuery = $('#' + stageID);
    //   stage.html(CC.templates[template]());
    //   if (callback) callback();
    // };
    //
    // switchScene('stage-1', 'swiper', initSwiper);

new App.init();
