/// <reference path="../../typings/tsd.d.ts" />

"use strict"

declare var CC: any;

module Swiper {

    export class View {
        templateName: string;

        render(data: any) {
            var tmpl:string = CC.templates[this.templateName](data);
            var elem:JQuery = $(tmpl);
            return elem;
        }

        constructor() {

        }
    }

    export class DeckView extends View {
        templateName = 'deck';

        constructor() {
            super()
        }
    }

    export class CardView extends View {
        templateName = 'card';

        constructor() {
            super()
        }
    }
}
