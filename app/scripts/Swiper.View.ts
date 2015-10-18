/// <reference path="../../typings/tsd.d.ts" />

"use strict"

declare var CC: any;

module Swiper {

    export class View {
        templateName: string;

        render(data: any) {
            return CC.templates[this.templateName]();
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
}