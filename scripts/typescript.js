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
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
        }
        Card.prototype.transform = function () {
            var transformations = [];
            transformations.push("translateX(" + this.newTranslateX + "px)");
            transformations.push("translateY(" + this.translateY + "px)");
            transformations.push("rotate(" + this.rotate + "deg)");
            this.elemImg.css('transform', transformations.join(' '));
        };
        ;
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
                _this.newTranslateX = _this.translateX + evt.deltaX;
                _this.rotate = (Math.abs(evt.deltaX) < deltaMax) ? evt.deltaX / deltaMax * degMax : Math.sign(_this.newTranslateX) * degMax;
                _this.transform();
            });
            this.hammer.on("panend", function (evt) {
                _this.elemImg.addClass('tween');
                var apex = 180;
                var distance = _this.newTranslateX - _this.translateX;
                if (Math.abs(distance) > apex) {
                    _this.rotate = (distance > 0) ? 30 : -30;
                    _this.translateX = _this.translateX + distance;
                    _this.translateX = _this.translateX + distance;
                    _this.model.rate(_this, 1);
                }
                else {
                    _this.rotate = 0;
                }
                _this.newTranslateX = _this.translateX;
                _this.transform();
            });
        };
        ;
        Card.prototype.updatePosition = function () {
            this.translateY = parseInt(this.elemImg.css('transform').split(',')[5], 10);
            this.translateX = parseInt(this.elemImg.css('transform').split(',')[4], 10);
            this.newTranslateX = this.translateX;
            this.rotate = 0;
        };
        ;
        Card.prototype.draw = function () {
            var _this = this;
            _super.prototype.draw.call(this);
            var _init = function () {
                _this.hammer = new Hammer(_this.elemImg[0]);
                _this.updatePosition();
                _this.registerEvents();
            };
            if (this.elemImg[0].width > 0 && this.elemImg[0].height > 0) {
                _init();
            }
            else {
                this.elemImg.load(function () {
                    _init();
                });
            }
        };
        ;
        Card.prototype.init = function () {
            this.elemImg = this.elem.find('.swiper-img');
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
        Deck.prototype.switchCard = function () {
            var i = 0;
            var len;
            var limit = (len < 3) ? len : 3;
            this.removeFrontCard();
            len = this.pile.length;
            while (i < limit) {
                this.pile[i].elem.removeClass('m-front-' + (i + 2)).addClass('m-front-' + (i + 1));
                i++;
            }
            if (this.pile.length < 4)
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
            if (index < 4) {
                card.elem.addClass('m-front-' + index);
            }
            ;
            card.draw();
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
