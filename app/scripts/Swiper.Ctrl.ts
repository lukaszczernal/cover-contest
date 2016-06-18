/// <reference path="../../typings/tsd.d.ts" />

"use strict"

module Swiper {

    export class Ctrl {

        elem: JQuery;

        render(): Ctrl {
            var data = this.model;
            this.elem = this.view.render(data);
            return this;
        }

        draw(): Ctrl {
            this.parent.prepend(this.elem)
            return this;
        }

        show(): Ctrl {
            this.parent.show();
            return this;
        }

        init(): Ctrl {
            return this;
        }

        activate(): Ctrl {
            return this;
        }

        animate(type: string): Ctrl {
            return this;
        }

        constructor(public parent: JQuery, public model: any, public view: Swiper.View) {
            this.render();
            this.init();
        }
    }
}
