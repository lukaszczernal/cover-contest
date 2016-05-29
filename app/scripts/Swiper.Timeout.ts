/// <reference path="../../typings/tsd.d.ts" />

"use strict"

//TODO try to implement it as setTimeout prototype

module Swiper {

    export class Timeout {
        timeout:any;
        completed:boolean = false;

        resolve() {
            this.reject();
            this.callback();
        }

        reject() {
            clearTimeout(this.timeout);
            this.resolve = function() {};
        }

        constructor(public callback:{():void}, delay:number) {
            this.timeout = setTimeout(this.resolve.bind(this), delay);
        }

    }
}
