/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Home.Model.ts" />
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

    init() {
        this.startButton = this.elem.children('.home-start');
        this.registerEvents();
    }

    constructor(parent: JQuery, model: HomeModel, view: View) {
        super(parent, model, view);
        this.draw();
    }

  }

}
