/// <reference path="./Swiper.Model.ts" />

module Swiper {

  export class Route {
    static statesElem: JQuery = $('.state');

    static states: any = {};

    static hideAllStates() {
        this.statesElem.hide();
    }

    static goto(name: string, animationType: string = ''): Ctrl {
        this.hideAllStates();
        return Route.get(name)
            .activate()
            .show()
            .animate(animationType);
    }

    static get(name: string): Ctrl {
      let target = this.states[name];

      if (!target) {
        target = this.init(name);
        this.states[name] = target;
      }

      return target;
    }

    static init = (moduleName: string) => {
      console.count(moduleName+' init');
      //TODO try to get rid of those module name transformations
      let moduleCapital: string   = Route.toCapitalLetter(moduleName);
      let moduleElem: string  = '#' + moduleName;
      let moduleModel: string = moduleCapital + 'Model';

      let elem = $(moduleElem);
      let model = (Swiper[moduleModel])? new Swiper[moduleModel]() : new Model();
      let view = new Swiper.View(moduleName);

      return new Swiper[moduleCapital](elem, model, view);
    }

    static toCapitalLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

  }

}
