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

        animationOnFinishCallback = () => {
            this.elem.remove();
            Events.publish(Events.TYPE.RATE_END);
        }

        transform() {
            var transformations: string[] = [];
            transformations.push("translateX(" + this.newTranslateX + "px)");
            transformations.push("translateZ(0)"); // hardware acceleration
            transformations.push("rotate(" + this.rotate + "deg)");

            if (this.model.isRated) {

                let animationPromise = this.elemImg[0].animate([
                    {transform: this.elemImg[0].style.transform},
                    {transform: transformations.join(' ')}
                ],{
                    duration: 300,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                animationPromise.onfinish = this.animationOnFinishCallback;

            } else {
                this.elemImg.css('transform', transformations.join(' '));
            }
        };

        setOverlay(direction, percentage) {
            var color: string;

            percentage = percentage * 0.2
            color = (direction < 0) ? '#ea0c0c' : '#84ea0c';

            this.elemOverlay.css('backgroundColor', color);
            this.elemOverlay.css('opacity', percentage);
        }

        registerEvents() {

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
                var apex:number = 70;
                var distance:number = this.newTranslateX - this.translateX;
                var direction:number = Math.sign(distance);
                var velocity:number = Math.abs(evt.velocity) < 3 ? 3 : Math.abs(evt.velocity);

                if (Math.abs(distance) > apex) {
                    this.rotate = 30 * direction;
                    this.translateX += (distance * velocity);
                    this.rate();
                } else {
                    this.rotate = 0;
                }
                this.newTranslateX = this.translateX;
                this.transform();
                this.setOverlay(0, 0);
            });
        };

        private rate() {
          this.unRegisterEvents();
          this.elemImg.addClass('m-rated');
          this.elemTitle.addClass('m-rated');
          this.model.rate()
        }

        unRegisterEvents() {
            this.hammerElem.destroy();
            // this.elemImg.unbind('transitionend'); @TODO to be considered
        }

        updatePosition() {
            var _transformValue:string[] = this.elemImg.css('transform').split(',')
            if (_transformValue[0] !== 'none') { // if display is set to none then no transform value is detected
                this.translateX = parseInt(_transformValue[4], 10);
                // this.newTranslateX = this.translateX;
                this.rotate = 0;
            }
        };

        draw(index: number = 0) {
            super.draw();

            this.hammerElem = new Hammer(this.elemImg[0]);
            this.updatePosition();

            // If card is front-most then add event listeners
            if (index == 1) this.registerEvents();
        };

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
