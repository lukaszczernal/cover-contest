/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.View.ts" />

"use strict"

module Swiper {
    export class Card extends Ctrl {
        elemImg: JQuery;
        hammer: HammerManager;
        newTranslateX: number = 0;
        translateX: number = 0;
        rotate: number = 0;

        transform() {
            var transformations: string[] = [];
            transformations.push("translateX(" + this.newTranslateX + "px)");
            transformations.push("rotate(" + this.rotate + "deg)");
            this.elemImg.css('transform', transformations.join(' '));
        };

        setOverlay(direction, percentage) {
            var color: string;

            percentage = percentage * 0.2
            color = (direction < 0) ? '#ea0c0c' : '#84ea0c';

            this.elemOverlay.css('backgroundColor', color);
            this.elemOverlay.css('opacity', percentage);
        }

        registerEvents() {
            this.elemImg.on('transitionend', () => {
                this.updatePosition();
            });

            this.hammer.on("panstart", () => {
                this.elemImg.removeClass('tween');
            });

            this.hammer.on("panleft panright", (evt: HammerInput) => {
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

            this.hammer.on("panend", (evt: HammerInput) => {
                this.elemImg.addClass('tween');
                var apex:number = 70;
                var distance:number = this.newTranslateX - this.translateX;
                var direction:number = Math.sign(distance);

                if (Math.abs(distance) > apex) {
                    // TODO we can subscribe to onRate event
                    this.rotate = 30 * direction;
                    this.translateX += (distance * 4); //TODO this should be calculated based on screen width
                    this.unRegisterEvents();
                    this.elemTitle.addClass('m-rated');
                    this.model.rate(this, 1);
                } else {
                    this.rotate = 0;
                }
                this.newTranslateX = this.translateX;
                this.transform();
                this.setOverlay(0, 0);
            });
        };

        unRegisterEvents() {
            this.hammer.destroy();
            // this.elemImg.unbind('transitionend'); @TODO to be considered
        }

        updatePosition() {
            var _transformValue: string = this.elemImg.css('transform').split(',')
            if (_transformValue[0] !== 'none') { // if display is set to none then no transform value is detected
                this.translateX = parseInt(_transformValue[4], 10);
                this.newTranslateX = this.translateX;
                this.rotate = 0;
            }
        };

        draw(index: int = 0) {
            super.draw();

            this.hammer = new Hammer(this.elemImg[0]);
            this.updatePosition();

            // If card is front-most then add event listeners
            if (index == 1) this.registerEvents();
        };

        init() {
            this.elemImg     = this.elem.find('.card-img');
            this.elemTitle   = this.elem.find('.card-title');
            this.elemOverlay = this.elem.find('.card-imgOverlay');
        };

        constructor(parent :JQuery, model:Swiper.Model, view:CardView) {
            super(parent, model, view);
        };
    };
}
