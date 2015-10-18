/// <reference path="../../typings/tsd.d.ts" />

"use strict"

declare var CC: any;

module Swiper {

    export class View {
        templateName: string;

        render(data: any) {
            var elem:string = CC.templates[this.templateName]();
            elem = $(elem);
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
