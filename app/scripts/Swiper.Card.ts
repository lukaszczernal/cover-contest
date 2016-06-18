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

        setOverlay(direction:number) {
            let color:string = '#fff';
            let opacity:number = Math.abs(direction);
            let content:string = '';

            switch (direction) {
                case 1:
                    color = '#90dc95';
                    content = 'Yea!'
                    break;
                case -1:
                    color = '#dc9090';
                    content = 'Nah!'
                    break;
            }

            this.elemOverlay
            .css('color', color)
            .css('opacity', opacity)
            .attr('data-content', content);
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
                this.setOverlay(direction);
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
                    this.setOverlay(direction);
                } else {
                    this.rotate = 0;
                    this.setOverlay(0);
                }
                this.newTranslateX = this.translateX;
                this.transform();
            });
        };

        private onRateEnd(direction: number) {
            this.elemTitle.addClass('m-rated');
            this.elemImg
              .addClass('m-rated')
              .one('transitionend', () => {
                  this.elem.remove();
                  Events.publish(Events.TYPE.RATE_END, direction);
              });
        }

        private rate(direction: number) {
            this.unRegisterEvents();
            this.model.rate(direction);
            this.onRateEnd(direction);
        }

        unRegisterEvents() {
            this.hammerElem.destroy();
            // this.elemImg.unbind('transitionend'); @TODO to be considered
        }

        draw(): Ctrl {
            super.draw();
            this.hammerElem = new Hammer(this.elemImg[0]);
            return this;
        };

        isFirst(): boolean {
            return this.position === 0;
        }

        setPosition(index:number = Config.pileSize) {
            // TODO speed of animation should depend of the distance
            index = (index < Config.pileSize) ? index : Config.pileSize;
            this.position = index;
            this.setClass(index);

            // If card is front-most then add event listeners
            if (this.isFirst())
                this.registerEvents();
        }

        moveTo(index:number) {
            setTimeout( () => {  // without timeout animation is not visible when entering stage
                this.setPosition(index) }
            , 0);
        }

        private setClass(index:number) {
            this.elem.addClass(this.cls(index));
        }

        private cls(index) {
            return 'm-front-' + index;
        }

        init(): Ctrl {
            this.elemImg     = this.elem.find('.card-img');
            this.elemTitle   = this.elem.find('.card-title');
            this.elemOverlay = this.elem.find('.card-imgOverlay');
            return this;
        };

        constructor(parent:JQuery, model: CardModel, view:View) {
            super(parent, model, view);
        };
    };
}
