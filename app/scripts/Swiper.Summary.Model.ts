"use strict"

module Swiper {

    export class SummaryModel extends Collection {
        likeList: Model[]
        dislikeList: Model[]

        private resetList() {
            this.likeList = [];
            this.dislikeList = [];
        }

        update() {
            let cards = Route.get('deck').model.collection; // gets collection from last game
            this.resetList();
            cards.forEach((card) => {
                let list = (card.rating > 0) ? this.likeList : this.dislikeList;
                list.push(card);
            })

        }

    }

}
