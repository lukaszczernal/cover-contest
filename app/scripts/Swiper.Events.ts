"use strict"

module Swiper {

  export class Events {
      static TYPE = {
          'RATE_START': 'onRATEstart'
          'RATE_END': 'onRATEend'
          'RATE': 'onRATE',
          'GET': 'onGET',
          'START': 'onSTART',
          'END': 'onEND'
      }

      static subscribers: any = {};

      static isEventRegistered(event: string) {
          return !!this.subscribers[event]
      }

      static subscribe(event: any, callback: any) {
          if (!this.subscribers[event]) {
              this.subscribers[event] = [];
          }
          this.subscribers[event].push(callback);
      };

      static publish(event: string, data?: any) {
          if (!this.isEventRegistered(event)) return false

          var _sendSubscription = (elem:any, i:number) => {
              this.subscribers[event][i](data);
          };

          this.subscribers[event].forEach(_sendSubscription)
      }
  }
}
