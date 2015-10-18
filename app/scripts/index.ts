/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.View.ts" />
/// <reference path="./Swiper.Ctrl.Card.ts" />
/// <reference path="./Swiper.Ctrl.Deck.ts" />

"use strict"

declare var CC: any;

// function switchScene(stageID: string, template: string, callback: Function) {
//   var stage: JQuery = $('#' + stageID);
//   stage.html(CC.templates[template]());
//   if (callback) callback();
// };

function initSwiper() {
    var elem = $('#stage-1');
    var model = new Swiper.Cards();
    var view = new Swiper.DeckView();

    new Swiper.Deck(elem, model, view);
};

initSwiper();
// switchScene('stage-1', 'swiper', initSwiper);