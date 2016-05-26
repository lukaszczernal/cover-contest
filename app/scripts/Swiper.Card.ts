/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Card.Model.ts" />
/// <reference path="./Swiper.View.ts" />

"use strict"

module Swiper {
    export class Card extends Ctrl {
        elemImg: JQuery;
        elemTitle: JQuery;
        elemOverlay: JQuery;
        hammerElem: HammerManager;
        newTranslateX: number = 0;
        translateX: number = 0;
        rotate: number = 0;
        position: number = 0;

        transform() {
            var transformations: string[] = [];
            transformations.push("translateX(" + this.newTranslateX + "px)");
            transformations.push("translateZ(0)"); // hardware acceleration
            transformations.push("rotate(" + this.rotate + "deg)");
            this.elemImg.css('transform', transformations.join(' '));
        };

        setOverlay(direction:number, percentage:number) {
            var color: string;

            percentage = percentage * 0.6;
            color = (direction < 0) ? '#ea0c0c' : '#84ea0c';

            this.elemOverlay.css('backgroundColor', color);
            this.elemOverlay.css('opacity', percentage);
        }

        registerEvents() {

            this.elemImg.on('transitionend', () => {
                // this.elem.remove();
                // Events.publish(Events.TYPE.RATE_END);
            });

            this.hammerElem.on("panstart", () => {
                this.elemImg.removeClass('tween');
                Events.publish(Events.TYPE.RATE_START);
            });

            this.hammerElem.on("panleft panright", (evt: HammerInput) => {
                var degMax: number = 10;
                var deltaMax: number = 200;
                var direction: number;
                var deltaPerc: number;
                var deltaAbsValue: number;

                deltaAbsValue = Math.abs(evt.deltaX);
                deltaPerc     = deltaAbsValue / deltaMax;
                direction     = Math.sign(evt.deltaX);

                this.newTranslateX = this.translateX + evt.deltaX;
                this.rotate = (deltaAbsValue < deltaMax) ? direction * deltaPerc * degMax : direction * degMax;

                this.transform();
                this.setOverlay(direction, deltaPerc);
            });

            this.hammerElem.on("panend", (evt: HammerInput) => {
                this.elemImg.addClass('tween');
                let apex:number = 70;
                let distance:number = this.newTranslateX - this.translateX;
                let direction:number = Math.sign(distance);
                let velocity:number = Math.abs(evt.velocity) < 3 ? 3 : Math.abs(evt.velocity);

                if (Math.abs(distance) > apex) {
                    this.rotate = 30 * direction;
                    this.translateX += (distance * velocity);
                    this.rate(direction);
                } else {
                    this.rotate = 0;
                }
                this.newTranslateX = this.translateX;
                this.transform();
                this.setOverlay(0, 0);
            });
        };

        private onRateEnd() {
            this.elemTitle.addClass('m-rated');
            this.elemImg
              .addClass('m-rated')
              .one('transitionend', () => {
                  this.elem.remove();
                  Events.publish(Events.TYPE.RATE_END);
              });
        }

        private rate(direction:number) {
            this.unRegisterEvents();
            this.model.rate(direction);
            this.onRateEnd();
        }

        unRegisterEvents() {
            this.hammerElem.destroy();
            // this.elemImg.unbind('transitionend'); @TODO to be considered
        }

        draw() {
            super.draw();
            this.hammerElem = new Hammer(this.elemImg[0]);
        };

        isFirst(): boolean {
            return this.position === 0;
        }

        setPosition(index:number = Config.pileSize) {
            index = (index < Config.pileSize) ? index : Config.pileSize;
            this.position = index;
            this.setClass(index);

            // If card is front-most then add event listeners
            if (this.isFirst())
                this.registerEvents();
        }

        moveTo(index:number) {
            this.setPosition(index);
        }

        private setClass(index:number) {
            this.elem.addClass(this.cls(index));
        }

        private cls(index) {
            return 'm-front-' + index;
        }

        init() {
            this.elemImg     = this.elem.find('.card-img');
            this.elemTitle   = this.elem.find('.card-title');
            this.elemOverlay = this.elem.find('.card-imgOverlay');
        };

        constructor(parent:JQuery, model: CardModel, view:View) {
            super(parent, model, view);
        };
    };
}
