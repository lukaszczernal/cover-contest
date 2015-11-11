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

    export interface SubscriberEvents {

    }

    export class SubscriberPublisher {
        subscribers: any = {};

        isEventRegistered(event: string) {
            return !!this.subscribers[event]
        }

        subscribe(event: any, callback: any) {
            if (!this.subscribers[event]) {
                this.subscribers[event] = [];
            }
            this.subscribers[event].push(callback);
        };

        publish(event: string, data?: any) {
            if (!this.isEventRegistered(event)) return false

            var _sendSubscription = (elem:any, i:number) => {
                this.subscribers[event][i](data);
            };

            this.subscribers[event].forEach(_sendSubscription)
        }
    }

    export class Model extends SubscriberPublisher {
        publish(event: string, data?: any) {
            super.publish(event, data);
            if (!!this.collection) this.collection.publish(event, data); // Event proxy
        }

        constructor(public data: any, public collection: Swiper.Collection) {
            super()
        }
    }

    export class Collection extends SubscriberPublisher {
        EVENTS: any = {
            'GET': 'onGET'
        };
        data: Array<Swiper.Model> = [];
        source: string = null;
        model: any;

        get() {
            var rawData: any;
            var transformedData: Array<Cards> = [];

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

    export class CardsCollection extends Collection {
        source = 'data.json';
        model = Swiper.Cards;
    }

    export class Cards extends Model {
        EVENTS: any = {
            'RATE': 'onRATE'
        };
        rate(card: CardResponse, grade: number) {
            this.publish(this.EVENTS.RATE);
        }

        constructor(data: CardResponse, collection: Swiper.CardsCollection) {
            super(data, collection)
        }
    }
}
