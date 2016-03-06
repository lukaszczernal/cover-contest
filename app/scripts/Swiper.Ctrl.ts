/// <reference path="../../typings/tsd.d.ts" />

"use strict"

module Swiper {

    export class Ctrl {

        elem: JQuery;

        render() {
            var data = this.model;
            this.elem = this.view.render(data);
        }

        draw() {
            this.parent.prepend(this.elem)
        }

        init() {

        }

        activate() {

        }

        constructor(public parent: JQuery, public model: any, public view: Swiper.View) {
            this.render();
            this.init();
        }
    }
}
