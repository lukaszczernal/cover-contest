/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.View.ts" />

"use strict"

module Swiper {
    export class Card extends Ctrl {
        elemImg: JQuery;
        hammer: HammerManager;
        newTranslateX: number;
        translateX: number;
        translateY: number;
        rotate: number;

        transform() {
            var transformations: string[] = [];
            transformations.push("translateX(" + this.newTranslateX + "px)");
            transformations.push("translateY(" + this.translateY + "px)");
            transformations.push("rotate(" + this.rotate + "deg)");
            this.elemImg.css('transform', transformations.join(' '));
        };

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

                this.newTranslateX = this.translateX + evt.deltaX;
                this.rotate = (Math.abs(evt.deltaX) < deltaMax) ? evt.deltaX / deltaMax * degMax : Math.sign(this.newTranslateX) * degMax;

                this.transform();
            });

            this.hammer.on("panend", (evt: HammerInput) => {
                this.elemImg.addClass('tween');
                var apex: number = 180
                var distance: number = this.newTranslateX - this.translateX;

                if (Math.abs(distance) > apex) {
                    this.rotate = (distance > 0) ? 30 : -30;
                    this.translateX = this.translateX + distance;
                    this.translateX = this.translateX + distance;
                    this.model.rate(this, 1);
                } else {
                    this.rotate = 0;
                }
                this.newTranslateX = this.translateX;
                this.transform();
            });
        };

        updatePosition() {
            this.translateY = parseInt(this.elemImg.css('transform').split(',')[5], 10);
            this.translateX = parseInt(this.elemImg.css('transform').split(',')[4], 10);
            this.newTranslateX = this.translateX;
            this.rotate = 0;
        };

        draw() {
            super.draw();

            var _init = () => {
                this.hammer = new Hammer(this.elemImg[0]);
                this.updatePosition()
                this.registerEvents();
            }

            if (this.elemImg[0].width > 0 && this.elemImg[0].height > 0) {
                _init()
            } else {
                this.elemImg.load(() => {
                    _init()
                })
            }
        };

        init() {
            this.elemImg = this.elem.find('.swiper-img');
        };

        constructor(parent:JQuery, model:Swiper.Model, view:CardView) {
            super(parent, model, view);
        };
    };
}
