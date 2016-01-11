/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Events.ts" />

"use strict"

module Swiper {

  export class Collection extends SubscriberPublisher {
        EVENTS: any = {
            'GET': 'onGET'
        };
        data: Array<Swiper.Model> = [];
        source: string = null;
        model: any;

        get() {
            var rawData: any;
            var transformedData: Array<CardModel> = [];

            var _transform = (cardData: CardResponse) => {
                transformedData.push(new this.model(cardData, this));
            };

            var _fetchSuccess = (res: any) => {
                rawData = res.data;
                rawData.forEach(_transform);
                this.data.concat(transformedData);
                this.publish(this.EVENTS.GET, transformedData);
            };

            $.ajax(this.source).done(_fetchSuccess)
        }

        constructor() {
            super()
        }
    }

}
