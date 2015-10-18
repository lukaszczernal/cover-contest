/// <reference path="../../typings/tsd.d.ts" />

"use strict"

module Swiper {

    export interface CardsResponse {
        data: Array<CardResponse>;
        count: number;
    }

    export interface CardResponse {
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
