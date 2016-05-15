"use strict"

module Swiper {

    export class SummaryModel extends Collection {

        update() {
            this.collection = Route.get('deck').model.collection; // gets collection from last game
        }

    }

}
