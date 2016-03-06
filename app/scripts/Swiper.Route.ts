/// <reference path="./Swiper.Model.ts" />

module Swiper {

  export class Route {
    static statesElem: JQuery = $('.state');

    static states: any = {};

    static goto(name: string) {
      let target = Route.get(name);
      target.activate(); // todo deactivate previous state
      this.statesElem.hide();
      target.parent.show();
    }

    static get(name:string): Ctrl {
      let target = this.states[name];

      if (!target) {
        target = this.init(name);
        this.states[name] = target;
      }

      return target;
    }

    static init = (moduleName: string) => {
      console.count(moduleName+' init');
      let moduleLowerCase: string = moduleName.toLowerCase();
      let moduleCapital: string   = Route.toCapitalLetter(moduleLowerCase);
      let moduleElem: string  = '#' + moduleLowerCase;
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
