"use strict"

module Swiper {

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
}
