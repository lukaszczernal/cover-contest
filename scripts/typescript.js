/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Swiper;
(function (Swiper) {
    var SubscriberPublisher = (function () {
        function SubscriberPublisher() {
            this.subscribers = {};
        }
        SubscriberPublisher.prototype.isEventRegistered = function (event) {
            return !!this.subscribers[event];
        };
        SubscriberPublisher.prototype.subscribe = function (event, callback) {
            if (!this.subscribers[event]) {
                this.subscribers[event] = [];
            }
            this.subscribers[event].push(callback);
        };
        ;
        SubscriberPublisher.prototype.publish = function (event, data) {
            var _this = this;
            if (!this.isEventRegistered(event))
                return false;
            var _sendSubscription = function (elem, i) {
                _this.subscribers[event][i](data);
            };
            this.subscribers[event].forEach(_sendSubscription);
        };
        return SubscriberPublisher;
    })();
    Swiper.SubscriberPublisher = SubscriberPublisher;
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(data, collection) {
            _super.call(this);
            this.data = data;
            this.collection = collection;
        }
        Model.prototype.publish = function (event, data) {
            _super.prototype.publish.call(this, event, data);
            if (!!this.collection)
                this.collection.publish(event, data); // Event proxy
        };
        return Model;
    })(SubscriberPublisher);
    Swiper.Model = Model;
    var Collection = (function (_super) {
        __extends(Collection, _super);
        function Collection() {
            _super.call(this);
            this.EVENTS = {
                'GET': 'onGET'
            };
            this.data = [];
            this.source = null;
        }
        Collection.prototype.get = function () {
            var _this = this;
            var rawData;
            var transformedData = [];
            var _transform = function (cardData) {
                transformedData.push(new _this.model(cardData, _this));
            };
            var _fetchSuccess = function (res) {
                rawData = res.data;
                rawData.forEach(_transform);
                _this.data.concat(transformedData);
                _this.publish(_this.EVENTS.GET, transformedData);
            };
            $.ajax(this.source).done(_fetchSuccess);
        };
        return Collection;
    })(SubscriberPublisher);
    Swiper.Collection = Collection;
    var CardsCollection = (function (_super) {
        __extends(CardsCollection, _super);
        function CardsCollection() {
            _super.apply(this, arguments);
            this.source = 'data.json';
            this.model = Swiper.Cards;
        }
        return CardsCollection;
    })(Collection);
    Swiper.CardsCollection = CardsCollection;
    var Cards = (function (_super) {
        __extends(Cards, _super);
        function Cards(data, collection) {
            _super.call(this, data, collection);
            this.EVENTS = {
                'RATE': 'onRATE'
            };
        }
        Cards.prototype.rate = function (card, grade) {
            this.publish(this.EVENTS.RATE);
        };
        return Cards;
    })(Model);
    Swiper.Cards = Cards;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var View = (function () {
        function View() {
        }
        View.prototype.render = function (data) {
            var tmpl = CC.templates[this.templateName](data);
            var elem = $(tmpl);
            return elem;
        };
        return View;
    })();
    Swiper.View = View;
    var DeckView = (function (_super) {
        __extends(DeckView, _super);
        function DeckView() {
            _super.call(this);
            this.templateName = 'deck';
        }
        return DeckView;
    })(View);
    Swiper.DeckView = DeckView;
    var CardView = (function (_super) {
        __extends(CardView, _super);
        function CardView() {
            _super.call(this);
            this.templateName = 'card';
        }
        return CardView;
    })(View);
    Swiper.CardView = CardView;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var Ctrl = (function () {
        function Ctrl(parent, model, view) {
            this.parent = parent;
            this.model = model;
            this.view = view;
            this.render();
            this.init();
        }
        Ctrl.prototype.render = function () {
            this.elem = this.view.render(this.model.data);
        };
        Ctrl.prototype.draw = function () {
            this.parent.prepend(this.elem);
        };
        Ctrl.prototype.init = function () {
        };
        return Ctrl;
    })();
    Swiper.Ctrl = Ctrl;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.View.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var Card = (function (_super) {
        __extends(Card, _super);
        function Card(parent, model, view) {
            _super.call(this, parent, model, view);
            this.newTranslateX = 0;
            this.translateX = 0;
            this.translateY = 0;
            this.rotate = 0;
        }
        Card.prototype.transform = function () {
            var transformations = [];
            transformations.push("translateX(" + this.newTranslateX + "px)");
            transformations.push("translateY(" + this.translateY + "px)");
            transformations.push("rotate(" + this.rotate + "deg)");
            this.elemImg.css('transform', transformations.join(' '));
        };
        ;
        Card.prototype.setOverlay = function (direction, percentage) {
            var color;
            percentage = percentage * 0.2;
            color = (direction < 0) ? 'red' : 'green';
            this.elemOverlay.css('backgroundColor', color);
            this.elemOverlay.css('opacity', percentage);
        };
        Card.prototype.registerEvents = function () {
            var _this = this;
            this.elemImg.on('transitionend', function () {
                _this.updatePosition();
            });
            this.hammer.on("panstart", function () {
                _this.elemImg.removeClass('tween');
            });
            this.hammer.on("panleft panright", function (evt) {
                var degMax = 10;
                var deltaMax = 200;
                var direction;
                var deltaPerc;
                var deltaAbsValue;
                deltaAbsValue = Math.abs(evt.deltaX);
                deltaPerc = deltaAbsValue / deltaMax;
                direction = Math.sign(evt.deltaX);
                _this.newTranslateX = _this.translateX + evt.deltaX;
                _this.rotate = (deltaAbsValue < deltaMax) ? direction * deltaPerc * degMax : direction * degMax;
                _this.transform();
                _this.setOverlay(direction, deltaPerc);
            });
            this.hammer.on("panend", function (evt) {
                _this.elemImg.addClass('tween');
                var apex = 100;
                var distance = _this.newTranslateX - _this.translateX;
                if (Math.abs(distance) > apex) {
                    // TODO we can subscribe to onRate event
                    _this.rotate = (distance > 0) ? 30 : -30;
                    _this.translateX += (distance * 3);
                    _this.unRegisterEvents();
                    _this.elemTitle.addClass('m-rated');
                    //
                    _this.model.rate(_this, 1);
                }
                else {
                    _this.rotate = 0;
                }
                _this.newTranslateX = _this.translateX;
                _this.transform();
                _this.setOverlay(0, 0);
            });
        };
        ;
        Card.prototype.unRegisterEvents = function () {
            this.hammer.destroy();
            // this.elemImg.unbind('transitionend'); @TODO to be considered
        };
        Card.prototype.updatePosition = function () {
            var _transformValue = this.elemImg.css('transform').split(',');
            if (_transformValue[0] !== 'none') {
                this.translateY = parseInt(_transformValue[5], 10);
                this.translateX = parseInt(_transformValue[4], 10);
                this.newTranslateX = this.translateX;
                this.rotate = 0;
            }
        };
        ;
        Card.prototype.draw = function (index) {
            if (index === void 0) { index = 0; }
            _super.prototype.draw.call(this);
            this.hammer = new Hammer(this.elemImg[0]);
            this.updatePosition();
            // If card is front-most then add event listeners
            if (index == 1)
                this.registerEvents();
        };
        ;
        Card.prototype.init = function () {
            this.elemImg = this.elem.find('.card-img');
            this.elemTitle = this.elem.find('.card-title');
            this.elemOverlay = this.elem.find('.card-imgOverlay');
        };
        ;
        ;
        return Card;
    })(Swiper.Ctrl);
    Swiper.Card = Card;
    ;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Ctrl.Card.ts" />
/// <reference path="./Swiper.Model.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var Deck = (function (_super) {
        __extends(Deck, _super);
        function Deck(parent, model, view) {
            _super.call(this, parent, model, view);
            this.pile = [];
            this.draw();
        }
        Deck.prototype.removeFrontCard = function () {
            var ratedCard;
            ratedCard = Array.prototype.shift.call(this.pile);
            ratedCard.elem.on('transitionend', function () {
                ratedCard.elem.remove();
            });
        };
        ;
        Deck.prototype.switchCard = function () {
            var i = 0;
            var len;
            var limit = (len < 4) ? len : 4;
            this.removeFrontCard();
            // @TODO add method to Card class - move forward (and add register event there)
            while (i < limit) {
                this.pile[i].elem.removeClass('m-front-' + (i + 2)).addClass('m-front-' + (i + 1));
                i++;
            }
            //register touch events for the top-most card
            this.pile[0].registerEvents();
            if (this.pile.length < (limit + 1))
                this.model.get();
        };
        ;
        Deck.prototype.createCards = function (cards) {
            var _this = this;
            cards.forEach(function (cardModel) {
                var cardCtrl = new Swiper.Card(_this.elemQueue, cardModel, new Swiper.CardView());
                _this.addCard(cardCtrl);
            });
        };
        Deck.prototype.addCard = function (card) {
            var index = this.pile.push(card);
            if (index < 5) {
                card.elem.addClass('m-front-' + index);
            }
            ;
            card.draw(index);
        };
        Deck.prototype.subscribeEvents = function () {
            var _this = this;
            this.model.subscribe('onRATE', function () { return _this.switchCard(); });
            this.model.subscribe('onGET', function (res) { return _this.createCards(res); });
        };
        Deck.prototype.init = function () {
            this.elemQueue = this.elem.find('.swiper-queue');
            this.subscribeEvents();
            this.model.get();
        };
        ;
        return Deck;
    })(Swiper.Ctrl);
    Swiper.Deck = Deck;
    ;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.View.ts" />
/// <reference path="./Swiper.Ctrl.Card.ts" />
/// <reference path="./Swiper.Ctrl.Deck.ts" />
"use strict";
// function switchScene(stageID: string, template: string, callback: Function) {
//   var stage: JQuery = $('#' + stageID);
//   stage.html(CC.templates[template]());
//   if (callback) callback();
// };
function initSwiper() {
    var elem = $('#stage-1');
    var model = new Swiper.CardsCollection();
    var view = new Swiper.DeckView();
    new Swiper.Deck(elem, model, view);
}
;
initSwiper();
// switchScene('stage-1', 'swiper', initSwiper); 
