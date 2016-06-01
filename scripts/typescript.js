var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    }());
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
            this.model = null;
            this.collection = [];
            this.total = 0;
            this.size = 10;
            this.emit = function () {
                Swiper.Events.publish(Swiper.Events.TYPE.GET, _this.collection);
                return _this.collection;
            };
        }
        return Collection;
    }());
    Swiper.Collection = Collection;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./Swiper.Collection.ts" />
/// <reference path="./Swiper.Card.Model.ts"/>
"use strict";
var Swiper;
(function (Swiper) {
    var DeckModel = (function (_super) {
        __extends(DeckModel, _super);
        function DeckModel() {
            _super.apply(this, arguments);
            this.total = 64; // todo last known count - how to calculate?
            this.count = 10;
        }
        DeckModel.prototype.source = function () {
            return "http://aws-xstream-api-production.xstream.dk/media/videos?limit=" + this.count + "&no_series=true&offset=" + this.randomOffset();
        };
        ;
        DeckModel.prototype.get = function () {
            return $.ajax(this.source())
                .then(this.transform.bind(this))
                .then(this.store.bind(this))
                .then(this.preload)
                .done(this.emit);
        };
        DeckModel.prototype.randomOffset = function () {
            var pages = Math.floor(this.total / this.count);
            var rand = Math.floor(Math.random() * pages) * this.count;
            return rand;
        };
        DeckModel.prototype.preload = function (cards) {
            var def = $.Deferred();
            var timeout = setTimeout(def.resolve, 5000);
            var len = cards.length;
            cards.forEach(preloadImage);
            function preloadImage(card) {
                var img = new Image();
                img.src = card.src;
                img.onload = onload;
            }
            ;
            function onload() {
                if (--len == 0) {
                    clearTimeout(timeout);
                    def.resolve();
                }
            }
            return def.promise();
        };
        DeckModel.prototype.store = function (cards) {
            this.total = cards.count;
            this.collection = cards;
            return cards;
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
        DeckModel.prototype.transform = function (data) {
            var _this = this;
            var cards = [];
            data.media.forEach(function (media) {
                var card = _this.transformCard(media);
                cards.push(new Swiper.CardModel(card));
            });
            return _.shuffle(cards);
        };
        return DeckModel;
    }(Swiper.Collection));
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
            this.rating = null;
            this.isRated = false;
            this.id = data.id;
            this.src = data.src;
            this.title = data.title;
        }
        CardModel.prototype.rate = function (direction) {
            this.isRated = true;
            this.rating = direction;
            Swiper.Events.publish(Swiper.Events.TYPE.RATE);
        };
        return CardModel;
    }());
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
    }());
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
    }());
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
            _super.call(this, parent, model, view);
            this.newTranslateX = 0;
            this.translateX = 0;
            this.rotate = 0;
            this.position = 0;
        }
        Card.prototype.transform = function () {
            var transformations = [];
            transformations.push("translateX(" + this.newTranslateX + "px)");
            transformations.push("translateZ(0)"); // hardware acceleration
            transformations.push("rotate(" + this.rotate + "deg)");
            this.elemImg.css('transform', transformations.join(' '));
        };
        ;
        Card.prototype.setOverlay = function (direction, percentage) {
            var color;
            percentage = percentage * 0.6;
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
                    _this.rate(direction);
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
        Card.prototype.onRateEnd = function () {
            var _this = this;
            this.elemTitle.addClass('m-rated');
            this.elemImg
                .addClass('m-rated')
                .one('transitionend', function () {
                _this.elem.remove();
                Swiper.Events.publish(Swiper.Events.TYPE.RATE_END);
            });
        };
        Card.prototype.rate = function (direction) {
            this.unRegisterEvents();
            this.model.rate(direction);
            this.onRateEnd();
        };
        Card.prototype.unRegisterEvents = function () {
            this.hammerElem.destroy();
            // this.elemImg.unbind('transitionend'); @TODO to be considered
        };
        Card.prototype.draw = function () {
            _super.prototype.draw.call(this);
            this.hammerElem = new Hammer(this.elemImg[0]);
        };
        ;
        Card.prototype.isFirst = function () {
            return this.position === 0;
        };
        Card.prototype.setPosition = function (index) {
            if (index === void 0) { index = Swiper.Config.pileSize; }
            index = (index < Swiper.Config.pileSize) ? index : Swiper.Config.pileSize;
            this.position = index;
            this.setClass(index);
            // If card is front-most then add event listeners
            if (this.isFirst())
                this.registerEvents();
        };
        Card.prototype.moveTo = function (index) {
            var _this = this;
            setTimeout(function () {
                _this.setPosition(index);
            }, 0);
        };
        Card.prototype.setClass = function (index) {
            this.elem.addClass(this.cls(index));
        };
        Card.prototype.cls = function (index) {
            return 'm-front-' + index;
        };
        Card.prototype.init = function () {
            this.elemImg = this.elem.find('.card-img');
            this.elemTitle = this.elem.find('.card-title');
            this.elemOverlay = this.elem.find('.card-imgOverlay');
        };
        ;
        ;
        return Card;
    }(Swiper.Ctrl));
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
        Config.pileSize = 3;
        return Config;
    }());
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
    }());
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
            target.activate();
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
    }());
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
            --this.ratingCount;
            if (this.ratingCount === 0)
                Swiper.Route.goto('summary');
        };
        // remove a card if the first on pile is really front one
        // initially all cards have position that is invisible on a rendered pile
        Deck.prototype.removeFrontCard = function () {
            if (this.pile[0].isFirst())
                this.pile.shift();
        };
        Deck.prototype.switchCard = function () {
            this.removeFrontCard();
            var len = this.pile.length;
            var limit = (len < Swiper.Config.pileSize) ? len : Swiper.Config.pileSize;
            for (var i = 0; i < limit; i++) {
                this.pile[i].moveTo(i);
            }
        };
        Deck.prototype.addCards = function (cards) {
            var _this = this;
            cards.forEach(function (cardModel) {
                _this.addCard(cardModel);
            });
        };
        Deck.prototype.addCard = function (cardModel) {
            var card = new Swiper.Card(this.elemQueue, cardModel, new Swiper.View('card'));
            this.pile.push(card);
            card.setPosition();
            card.draw();
        };
        Deck.prototype.onGetSuccess = function (cards) {
            this.addCards(cards);
        };
        Deck.prototype.subscribeEvents = function () {
            Swiper.Events.subscribe(Swiper.Events.TYPE.RATE, this.switchCard.bind(this));
            Swiper.Events.subscribe(Swiper.Events.TYPE.GET, this.onGetSuccess.bind(this));
            Swiper.Events.subscribe(Swiper.Events.TYPE.RATE_END, this.endGame.bind(this));
        };
        Deck.prototype.init = function () {
            this.elemQueue = this.elem.find('.swiper-queue');
            this.subscribeEvents();
        };
        ;
        Deck.prototype.activate = function () {
            this.ratingCount = this.model.count;
            //TODO improve (once its fetching the date once it just showing it)
            if (this.pile.length) {
                this.switchCard();
            }
            else {
                this.model.get()
                    .then(this.switchCard.bind(this));
            }
        };
        return Deck;
    }(Swiper.Ctrl));
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
    }());
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
            this.startButton.text('Loading');
            Swiper.Route.get('deck').model.get().done(this.onDealLoad.bind(this));
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
    }(Swiper.Ctrl));
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
            this.elem.fadeOut(300, function () {
                _this.elem.remove();
            });
        };
        Instructions.prototype.subscribeEvents = function () {
            var _this = this;
            Swiper.Events.subscribe('onRATEstart', function () { return _this.hide(); });
        };
        Instructions.prototype.init = function () {
            this.subscribeEvents();
        };
        return Instructions;
    }(Swiper.Ctrl));
    Swiper.Instructions = Instructions;
})(Swiper || (Swiper = {}));
"use strict";
"use strict";
var Swiper;
(function (Swiper) {
    var SummaryModel = (function (_super) {
        __extends(SummaryModel, _super);
        function SummaryModel() {
            _super.apply(this, arguments);
        }
        SummaryModel.prototype.update = function () {
            this.collection = Swiper.Route.get('deck').model.collection; // gets collection from last game
        };
        return SummaryModel;
    }(Swiper.Collection));
    Swiper.SummaryModel = SummaryModel;
})(Swiper || (Swiper = {}));
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
        Summary.prototype.draw = function () {
            this.parent.empty();
            _super.prototype.draw.call(this);
        };
        //TODO find out a way not to re-attache events
        Summary.prototype.activate = function () {
            this.model.update();
            this.render();
            this.draw();
            this.elemGoToDeck = this.parent.find('.summary-controlsBtn.goToDeck');
            ;
            this.elemGoToHome = this.parent.find('.summary-controlsBtn.goToHome');
            this.subscribeEvents();
        };
        Summary.prototype.init = function () { };
        ;
        return Summary;
    }(Swiper.Ctrl));
    Swiper.Summary = Summary;
})(Swiper || (Swiper = {}));
/// <reference path="../../typings/tsd.d.ts" />
"use strict";
//TODO try to implement it as setTimeout prototype
var Swiper;
(function (Swiper) {
    var Timeout = (function () {
        function Timeout(callback, delay) {
            this.callback = callback;
            this.completed = false;
            this.timeout = setTimeout(this.resolve.bind(this), delay);
        }
        Timeout.prototype.resolve = function () {
            this.reject();
            this.callback();
        };
        Timeout.prototype.reject = function () {
            clearTimeout(this.timeout);
            this.resolve = function () { };
        };
        return Timeout;
    }());
    Swiper.Timeout = Timeout;
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
