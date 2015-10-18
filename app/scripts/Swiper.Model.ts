/// <reference path="../../typings/tsd.d.ts" />

"use strict"

module Swiper {

    export interface DecksResponse {
        data: Array<DecksCardResponse>;
        count: number;
    }

    export interface DecksCardResponse {
        id: number;
        src: string;
        title: string;
    }

    export class Model {

        source: string = null;

        getAll() {
            return $.ajax(this.source)
        }

        constructor() {

        }

    }

    export class Cards extends Model {
        source = 'data.json'
    }

}