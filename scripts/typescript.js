"use strict";
var Swiper;
(function (Swiper) {
    var Events = (function () {
        function Events() {
        }
        Events.isEventRegistered = function (event) {
            return !!this.subscribers[event];
        };
        Events.subscribe = function (event, callback) {
            if (!this.subscribers[event]) {
                this.subscribers[event] = [];
            }
            this.subscribers[event].push(callback);
        };
        ;
        Events.publish = function (event, data) {
            var _this = this;
            if (!this.isEventRegistered(event))
                return false;
            var _sendSubscription = function (elem, i) {
                _this.subscribers[event][i](data);
            };
            this.subscribers[event].forEach(_sendSubscription);
        };
        Events.TYPE = {
            'RATE_START': 'onRATEstart',
            'RATE_END': 'onRATEend',
            'RATE': 'onRATE',
            'GET': 'onGET',
            'START': 'onSTART',
            'END': 'onEND'
        };
        Events.subscribers = {};
        return Events;
    })();
    Swiper.Events = Events;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Events.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var Collection = (function () {
        function Collection() {
            var _this = this;
            this.source = null;
            this.collection = [];
            this.total = 0;
            this.emit = function () {
                Swiper.Events.publish(Swiper.Events.TYPE.GET, _this.collection);
            };
        }
        return Collection;
    })();
    Swiper.Collection = Collection;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Collection.ts" />
/// <reference path="./Swiper.Card.Model.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Swiper;
(function (Swiper) {
    var DeckModel = (function (_super) {
        __extends(DeckModel, _super);
        function DeckModel() {
            var _this = this;
            _super.apply(this, arguments);
            this.source = 'http://aws-xstream-api-production.xstream.dk/media/videos?limit=10&no_series=true&offset=';
            this.model = Swiper.CardModel;
            this.total = 71; // todo last known count - how to calculate?
            this.transform = function (data) {
                var cards = [];
                data.media.forEach(function (media) {
                    var card = _this.transformCard(media);
                    cards.push(new Swiper.CardModel(card));
                });
                _this.total = data.count;
                _this.collection = _.shuffle(cards);
            };
        }
        DeckModel.prototype.get = function () {
            return $.ajax(this.source + this.randomOffset())
                .then(this.transform)
                .then(this.emit);
        };
        DeckModel.prototype.randomOffset = function () {
            var limit = 10; // todo this should come from config - related to deal settings
            var pages = Math.floor(this.total / limit);
            var rand = Math.floor(Math.random() * pages) * limit;
            return rand;
        };
        DeckModel.prototype.transformImage = function (images) {
            var len = images.length;
            while (len--) {
                var img = images[len].format['a-iPad-DVD-x2'];
                if (img) {
                    return img.source;
                }
            }
            ;
            return 'images/no-image.jpg';
        };
        DeckModel.prototype.transformCard = function (card) {
            return {
                id: card.id,
                src: this.transformImage(card.images),
                title: card.titles.default
            };
        };
        return DeckModel;
    })(Swiper.Collection);
    Swiper.DeckModel = DeckModel;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Events.ts"/>
/// <reference path="./Swiper.Deck.Model.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var CardModel = (function () {
        function CardModel(data) {
            this.id = null;
            this.src = null;
            this.title = null;
            this.isRated = false;
            this.id = data.id;
            this.src = data.src;
            this.title = data.title;
        }
        CardModel.prototype.rate = function () {
            this.isRated = true;
            Swiper.Events.publish(Swiper.Events.TYPE.RATE);
        };
        return CardModel;
    })();
    Swiper.CardModel = CardModel;
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
            var data = this.model;
            this.elem = this.view.render(data);
        };
        Ctrl.prototype.draw = function () {
            this.parent.prepend(this.elem);
        };
        Ctrl.prototype.init = function () {
        };
        Ctrl.prototype.activate = function () {
        };
        return Ctrl;
    })();
    Swiper.Ctrl = Ctrl;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var View = (function () {
        function View(templateName) {
            this.templateName = templateName;
        }
        View.prototype.render = function (data) {
            var tmpl = CC.templates[this.templateName](data);
            var elem = $(tmpl);
            return elem;
        };
        return View;
    })();
    Swiper.View = View;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Card.Model.ts" />
/// <reference path="./Swiper.View.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var Card = (function (_super) {
        __extends(Card, _super);
        function Card(parent, model, view) {
            var _this = this;
            _super.call(this, parent, model, view);
            this.newTranslateX = 0;
            this.translateX = 0;
            this.rotate = 0;
            this.animationOnFinishCallback = function () {
                _this.elem.remove();
                Swiper.Events.publish(Swiper.Events.TYPE.RATE_END);
            };
        }
        Card.prototype.transform = function () {
            var transformations = [];
            transformations.push("translateX(" + this.newTranslateX + "px)");
            transformations.push("translateZ(0)"); // hardware acceleration
            transformations.push("rotate(" + this.rotate + "deg)");
            if (this.model.isRated) {
                var animationPromise = this.elemImg[0].animate([
                    { transform: this.elemImg[0].style.transform },
                    { transform: transformations.join(' ') }
                ], {
                    duration: 300,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
                animationPromise.onfinish = this.animationOnFinishCallback;
            }
            else {
                this.elemImg.css('transform', transformations.join(' '));
            }
        };
        ;
        Card.prototype.setOverlay = function (direction, percentage) {
            var color;
            percentage = percentage * 0.2;
            color = (direction < 0) ? '#ea0c0c' : '#84ea0c';
            this.elemOverlay.css('backgroundColor', color);
            this.elemOverlay.css('opacity', percentage);
        };
        Card.prototype.registerEvents = function () {
            var _this = this;
            this.hammerElem.on("panstart", function () {
                _this.elemImg.removeClass('tween');
                Swiper.Events.publish(Swiper.Events.TYPE.RATE_START);
            });
            this.hammerElem.on("panleft panright", function (evt) {
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
            this.hammerElem.on("panend", function (evt) {
                _this.elemImg.addClass('tween');
                var apex = 70;
                var distance = _this.newTranslateX - _this.translateX;
                var direction = Math.sign(distance);
                var velocity = Math.abs(evt.velocity) < 3 ? 3 : Math.abs(evt.velocity);
                if (Math.abs(distance) > apex) {
                    _this.rotate = 30 * direction;
                    _this.translateX += (distance * velocity);
                    _this.rate();
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
        Card.prototype.rate = function () {
            this.unRegisterEvents();
            this.elemImg.addClass('m-rated');
            this.elemTitle.addClass('m-rated');
            this.model.rate();
        };
        Card.prototype.unRegisterEvents = function () {
            this.hammerElem.destroy();
            // this.elemImg.unbind('transitionend'); @TODO to be considered
        };
        Card.prototype.updatePosition = function () {
            var _transformValue = this.elemImg.css('transform').split(',');
            if (_transformValue[0] !== 'none') {
                this.translateX = parseInt(_transformValue[4], 10);
                // this.newTranslateX = this.translateX;
                this.rotate = 0;
            }
        };
        ;
        Card.prototype.draw = function (index) {
            if (index === void 0) { index = 0; }
            _super.prototype.draw.call(this);
            this.hammerElem = new Hammer(this.elemImg[0]);
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
"use strict";
var Swiper;
(function (Swiper) {
    var Config = (function () {
        function Config() {
        }
        Config.run = function () {
            this.setFastClick();
        };
        Config.setFastClick = function () {
            $(function () {
                FastClick.attach(document.body);
            });
        };
        return Config;
    })();
    Swiper.Config = Config;
})(Swiper || (Swiper = {}));
;
"use strict";
var Swiper;
(function (Swiper) {
    var Model = (function () {
        function Model() {
        }
        return Model;
    })();
    Swiper.Model = Model;
})(Swiper || (Swiper = {}));
/// <reference path="./Swiper.Model.ts" />
var Swiper;
(function (Swiper) {
    var Route = (function () {
        function Route() {
        }
        Route.goto = function (name) {
            var target = Route.get(name);
            target.activate(); // todo deactivate previous state
            this.statesElem.hide();
            target.parent.show();
        };
        Route.get = function (name) {
            var target = this.states[name];
            if (!target) {
                target = this.init(name);
                this.states[name] = target;
            }
            return target;
        };
        Route.toCapitalLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        Route.statesElem = $('.state');
        Route.states = {};
        Route.init = function (moduleName) {
            console.count(moduleName + ' init');
            var moduleLowerCase = moduleName.toLowerCase();
            var moduleCapital = Route.toCapitalLetter(moduleLowerCase);
            var moduleElem = '#' + moduleLowerCase;
            var moduleModel = moduleCapital + 'Model';
            var elem = $(moduleElem);
            var model = (Swiper[moduleModel]) ? new Swiper[moduleModel]() : new Swiper.Model();
            var view = new Swiper.View(moduleName);
            return new Swiper[moduleCapital](elem, model, view);
        };
        return Route;
    })();
    Swiper.Route = Route;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Card.ts" />
/// <reference path="./Swiper.Route.ts" />
/// <reference path="./Swiper.Events.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var Deck = (function (_super) {
        __extends(Deck, _super);
        function Deck(parent, model, view) {
            _super.call(this, parent, model, view);
            this.pile = [];
            this.draw();
            Swiper.Route.init('instructions');
        }
        Deck.prototype.endGame = function () {
            if (this.pile.length === 0)
                Swiper.Route.goto('summary');
        };
        Deck.prototype.removeFrontCard = function () {
            Array.prototype.shift.call(this.pile);
        };
        ;
        Deck.prototype.switchCard = function () {
            var i = 0;
            var len;
            var limit;
            this.removeFrontCard();
            len = this.pile.length;
            limit = (len < 4) ? len : 4;
            // @TODO add method to Card class - move forward (and add register event there)
            while (i < limit) {
                this.pile[i].elem.removeClass('m-front-' + (i + 2)).addClass('m-front-' + (i + 1));
                i++;
            }
            if (len > 0)
                this.pile[0].registerEvents(); //register touch events for the top-most card
        };
        ;
        Deck.prototype.createCards = function (cards) {
            var _this = this;
            cards.forEach(function (cardModel) {
                var cardCtrl = new Swiper.Card(_this.elemQueue, cardModel, new Swiper.View('card'));
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
            Swiper.Events.subscribe('onRATE', function () { return _this.switchCard(); });
            Swiper.Events.subscribe('onGET', function (res) { return _this.createCards(res); });
            Swiper.Events.subscribe('onRATEend', function () { _this.endGame(); });
        };
        Deck.prototype.init = function () {
            this.elemQueue = this.elem.find('.swiper-queue');
            this.subscribeEvents();
        };
        ;
        Deck.prototype.activate = function () {
            if (this.pile.length === 0)
                this.model.get();
        };
        return Deck;
    })(Swiper.Ctrl);
    Swiper.Deck = Deck;
    ;
})(Swiper || (Swiper = {}));
"use strict";
var Swiper;
(function (Swiper) {
    var HomeModel = (function () {
        function HomeModel() {
        }
        return HomeModel;
    })();
    Swiper.HomeModel = HomeModel;
})(Swiper || (Swiper = {}));
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Home.Model.ts" />
/// <reference path="./Swiper.Deck.ts" />
/// <reference path="./Swiper.Deck.Model.ts" />
/// <reference path="./Swiper.Route.ts" />
var Swiper;
(function (Swiper) {
    var Home = (function (_super) {
        __extends(Home, _super);
        function Home(parent, model, view) {
            _super.call(this, parent, model, view);
            this.draw();
        }
        Home.prototype.startContest = function () {
            Swiper.Route.goto('deck');
        };
        Home.prototype.registerEvents = function () {
            this.startButton.on('click', this.startContest);
        };
        Home.prototype.loadFirstDeal = function () {
            var _this = this;
            this.startButton.text('Loading');
            Swiper.Route.get('deck').model.get().done(function () { return _this.onDealLoad(); });
        };
        Home.prototype.onDealLoad = function () {
            this.registerEvents();
            this.startButton.text('Start');
        };
        Home.prototype.init = function () {
            this.startButton = this.elem.find('.home-start .btn');
            this.loadFirstDeal();
        };
        return Home;
    })(Swiper.Ctrl);
    Swiper.Home = Home;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Model.ts" />
/// <reference path="./Swiper.View.ts" />
/// <reference path="./Swiper.Events.ts"/>
"use strict";
var Swiper;
(function (Swiper) {
    var Instructions = (function (_super) {
        __extends(Instructions, _super);
        function Instructions(parent, model, view) {
            _super.call(this, parent, model, view);
            this.draw();
        }
        Instructions.prototype.hide = function () {
            var _this = this;
            var animationPromise = this.elem[0].animate([
                { opacity: 1 }, { opacity: 0 }
            ], {
                duration: 300,
                easing: 'ease-out',
                fill: 'forwards'
            });
            animationPromise.onfinish = function () { _this.elem.remove(); };
        };
        Instructions.prototype.subscribeEvents = function () {
            var _this = this;
            Swiper.Events.subscribe('onRATEstart', function () { return _this.hide(); });
        };
        Instructions.prototype.init = function () {
            this.subscribeEvents();
        };
        return Instructions;
    })(Swiper.Ctrl);
    Swiper.Instructions = Instructions;
})(Swiper || (Swiper = {}));
"use strict";
"use strict";
var Swiper;
(function (Swiper) {
    var SummaryModel = (function () {
        function SummaryModel() {
        }
        return SummaryModel;
    })();
    Swiper.SummaryModel = SummaryModel;
})(Swiper || (Swiper = {}));
/// <reference path="./Swiper.Ctrl.ts" />
/// <reference path="./Swiper.Route.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    var Summary = (function (_super) {
        __extends(Summary, _super);
        function Summary() {
            _super.apply(this, arguments);
        }
        Summary.prototype.goToDeck = function () {
            Swiper.Route.goto('deck');
        };
        Summary.prototype.goToHome = function () {
            Swiper.Route.goto('home');
        };
        Summary.prototype.subscribeEvents = function () {
            this.elemGoToDeck.click(this.goToDeck);
            this.elemGoToHome.click(this.goToHome);
        };
        Summary.prototype.init = function () {
            this.draw();
            this.elemGoToDeck = this.parent.find('.summary-goToDeck');
            this.elemGoToHome = this.parent.find('.summary-goToHome');
            this.subscribeEvents();
        };
        ;
        return Summary;
    })(Swiper.Ctrl);
    Swiper.Summary = Summary;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Config.ts" />
"use strict";
var Swiper;
(function (Swiper) {
    Swiper.Config.run();
    Swiper.Route.goto('home');
})(Swiper || (Swiper = {}));
;
