/// <reference path="../../typings/tsd.d.ts" />

"use strict"

declare var CC: any;

module Swiper {

    export class View {

        render(data: any) {
            var tmpl:string = CC.templates[this.templateName](data);
            var elem:JQuery = $(tmpl);
            return elem;
        }

        constructor(public templateName: string) {

        }

    }
}
