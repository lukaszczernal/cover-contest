/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Events.ts" />

"use strict"

module Swiper {

    export interface ICollection {
        model: any;
        collection: Model[];
        total: number;
        size: number;
        emit: any;
    }

    export class Collection implements ICollection {
        model = null;
        collection = [];
        total = 0;
        size = 10;
        emit = () => {
            Events.publish(Events.TYPE.GET, this.collection);
            return this.collection;
        }
    }
}
