/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Collection.ts" />
/// <reference path="./Swiper.Events.ts" />

"use strict"

module Swiper {

    export class Model extends SubscriberPublisher {
        publish(event: string, data?: any) {
            super.publish(event, data);
            if (!!this.model) this.model.publish(event, data); // Event proxy
        }

        constructor(public data: any, public model: Collection) {
            super()
        }
    }

}
