/// <reference path="../../typings/tsd.d.ts" />

"use strict"

module Swiper {

    export class Ctrl {

        renderView() {
            this.elem.html(this.view.render());
        }

        constructor(public elem:JQuery, public model:any, public view:any) {
            this.renderView()
        }
    }
}