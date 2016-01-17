module Swiper {

  export class Route {
    static statesElem: JQuery = $('.state');

    static states: any = {};

    static goto(name: string) {
      let target = this.states[name];

      if (!target) {
        console.count(name+' init');
        target = this.init(name);
        this.states[name] = target;
      }

      // todo deactivate previous state
      target.activate();

      this.statesElem.hide();
      target.parent.show();
    }

    static init(moduleName: string) {
      let moduleLowerCase: string = moduleName.toLowerCase();
      let moduleCapital: string   = this.toCapitalLetter(moduleLowerCase);
      let moduleElem: string  = '#' + moduleLowerCase;
      let moduleModel: string = moduleCapital + 'Model';

      let elem = $(moduleElem);
      let model = new Swiper[moduleModel]();
      let view = new Swiper.View(moduleName);

      return new Swiper[moduleCapital](elem, model, view);
    }

    static toCapitalLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

  }

}
