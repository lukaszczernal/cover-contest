/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Events.ts" />

"use strict"

module Swiper {

  export class Collection extends SubscriberPublisher {
        EVENTS: any = {
            'GET': 'onGET'
        };
        source: string = null;
        model: any;
        collection: Model[] = [];
        total: number = 0;
        emit = () => {
          this.publish(this.EVENTS.GET, this.collection);
        }

        get() {}

        constructor() {
            super()
        }
    }

}
