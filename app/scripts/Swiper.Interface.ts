
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

}
