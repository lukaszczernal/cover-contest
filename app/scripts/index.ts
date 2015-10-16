/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./SwiperCard.ts" />
/// <reference path="./SwiperDeck.ts" />

"use strict"

declare var CC: any;

function switchScene(stageID: string, template: string, callback: Function) {
  var stage: JQuery = $('#' + stageID);
  stage.html(CC.templates[template]());
  if (callback) callback();
};

function initSwiper() {
  new Swiper.Deck($('.swiper-queue'));
};

switchScene('stage-1', 'swiper', initSwiper);