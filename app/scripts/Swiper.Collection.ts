/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Events.ts" />

"use strict"

module Swiper {

  export class Collection {
        source: string = null;
        model: any;
        collection: Model[] = [];
        total: number = 0;
        emit = () => {
          Events.publish(Events.TYPE.GET, this.collection);
        }
    }
}
