var baseName, className, css, cssClass, defaults, faceNames, faceSequence, j, len, prefixList, prefixProp, prop, ref, ref1, urlRx,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

baseName = 'hexaFlip';

className = baseName[0].toUpperCase() + baseName.slice(1);

prefixList = ['webkit', 'Moz', 'O', 'ms'];

prefixProp = function(prop) {
  var j, len, prefix, prefixed;
  if (document.body.style[prop.toLowerCase()] != null) {
    return prop.toLowerCase();
  }
  for (j = 0, len = prefixList.length; j < len; j++) {
    prefix = prefixList[j];
    prefixed = prefix + prop;
    if (document.body.style[prefixed] != null) {
      return prefixed;
    }
  }
  return false;
};

css = {};

ref = ['Transform', 'Perspective'];
for (j = 0, len = ref.length; j < len; j++) {
  prop = ref[j];
  css[prop.toLowerCase()] = prefixProp(prop);
}

defaults = {
  size: 200,
  margin: 10,
  fontSize: 132,
  perspective: 1000,
  touchSensitivity: 0.45
};

cssClass = baseName.toLowerCase();

faceNames = ['front', 'left', 'back', 'right', 'top', 'bottom'];

faceSequence = faceNames.slice(0, 4);

urlRx = /^((((https?)|(file)):)?\/\/)|(data:)|(\.\.?\/)/i;

window.HexaFlip = (function() {
  function HexaFlip(el1, sets1, options1) {
    var cube, cubeFragment, i, image, k, key, len1, midPoint, option, ref1, ref2, set, setsKeys, setsLength, val, value, z;
    this.el = el1;
    this.sets = sets1;
    this.options = options1 != null ? options1 : {};
    this._onMouseOut = bind(this._onMouseOut, this);
    if (!(css.transform && this.el)) {
      return;
    }
    for (option in defaults) {
      value = defaults[option];
      this[option] = (ref1 = this.options[option]) != null ? ref1 : defaults[option];
    }
    if (typeof this.fontSize === 'number') {
      this.fontSize += 'px';
    }
    if (!this.sets) {
      this.el.classList.add(cssClass + '-timepicker');
      this.sets = {
        hour: (function() {
          var k, results;
          results = [];
          for (i = k = 1; k <= 12; i = ++k) {
            results.push(i + '');
          }
          return results;
        })(),
        minute: (function() {
          var k, results;
          results = [];
          for (i = k = 0; k <= 5; i = ++k) {
            results.push(i + '0');
          }
          return results;
        })(),
        meridian: ['am', 'pm']
      };
    }
    setsKeys = Object.keys(this.sets);
    setsLength = setsKeys.length;
    cubeFragment = document.createDocumentFragment();
    i = z = 0;
    midPoint = setsLength / 2 + 1;
    this.cubes = {};
    ref2 = this.sets;
    for (key in ref2) {
      set = ref2[key];
      cube = this.cubes[key] = this._createCube(key);
      if (++i < midPoint) {
        z++;
      } else {
        z--;
      }
      cube.el.style.zIndex = z;
      this._setContent(cube.front, set[0]);
      cubeFragment.appendChild(cube.el);
      for (k = 0, len1 = set.length; k < len1; k++) {
        val = set[k];
        if (urlRx.test(val)) {
          image = new Image;
          image.src = val;
        }
      }
    }
    this.cubes[setsKeys[0]].el.style.marginLeft = '0';
    this.cubes[setsKeys[setsKeys.length - 1]].el.style.marginRight = '0';
    this.el.classList.add(cssClass);
    this.el.style.height = this.size * 1.46 + 'px';
    this.el.style.width = ((this.size + this.margin * 2) * setsLength) - this.margin * 2 + 'px';
    this.el.style[css.perspective] = this.perspective + 'px';
    this.el.appendChild(cubeFragment);
  }

  HexaFlip.prototype._createCube = function(set) {
    var cube, eString, eventPair, eventPairs, fn1, k, l, len1, len2, len3, m, mouseLeaveSupport, rotate3d, side;
    cube = {
      set: set,
      offset: 0,
      y: 0,
      yDelta: 0,
      yLast: 0,
      x1: 0,
      xDelta: 0,
      xLast: 0,
      el: document.createElement('div')
    };
    cube.el.className = cssClass + "-cube " + cssClass + "-cube-" + set;
    cube.el.style.margin = "0 " + this.margin + "px";
    cube.el.style.width = this.size + 'px';
    cube.el.style.height = this.size * 1.46 + 'px';
    cube.el.style[css.transform] = this._getTransform(0, 0);
    for (k = 0, len1 = faceNames.length; k < len1; k++) {
      side = faceNames[k];
      cube[side] = document.createElement('div');
      cube[side].className = cssClass + '-' + side;
      rotate3d = (function() {
        switch (side) {
          case 'front':
            return '1, 0, 0, 0deg';
          case 'back':
            return '0, 1, 0, 180deg';
          case 'top':
            return '1, 0, 0, 90deg';
          case 'bottom':
            return '1, 0, 0, -90deg';
          case 'left':
            return '0, 1, 0, -90deg';
          case 'right':
            return '0, 1, 0, 90deg';
        }
      })();
      if (side === 'top' || side === 'bottom') {
        cube[side].style['width'] = this.size + "px";
        cube[side].style['height'] = this.size + "px";
      }
      cube[side].style[css.transform] = "rotate3d(" + rotate3d + ") translate3d(0, 0, " + (this.size / 2) + "px)";
      cube[side].style.fontSize = this.fontSize;
      cube.el.appendChild(cube[side]);
    }
    eventPairs = [['TouchStart', 'MouseDown'], ['TouchMove', 'MouseMove'], ['TouchEnd', 'MouseUp'], ['TouchLeave', 'MouseLeave']];
    mouseLeaveSupport = 'onmouseleave' in window;
    for (l = 0, len2 = eventPairs.length; l < len2; l++) {
      eventPair = eventPairs[l];
      fn1 = (function(_this) {
        return function(fn, cube) {
          if (!((eString === 'TouchLeave' || eString === 'MouseLeave') && !mouseLeaveSupport)) {
            return cube.el.addEventListener(eString.toLowerCase(), (function(e) {
              return _this[fn](e, cube);
            }), true);
          } else {
            return cube.el.addEventListener('mouseout', (function(e) {
              return _this._onMouseOut(e, cube);
            }), true);
          }
        };
      })(this);
      for (m = 0, len3 = eventPair.length; m < len3; m++) {
        eString = eventPair[m];
        fn1('_on' + eventPair[0], cube);
      }
    }
    this._setSides(cube);
    return cube;
  };

  HexaFlip.prototype._getTransform = function(degY, degX) {
    return "translateZ(-" + ((this.size * 1.46) / 2) + "px) rotateY(" + (-degX) + "deg)";
  };

  HexaFlip.prototype._setContent = function(el, content) {
    var key, style, val, value;
    if (!(el && content)) {
      return;
    }
    if (typeof content === 'object') {
      style = content.style, value = content.value;
      for (key in style) {
        val = style[key];
        el.style[key] = val;
      }
    } else {
      value = content;
    }
    if (urlRx.test(value)) {
      el.innerHTML = '';
      return el.style.backgroundImage = "url(" + value + ")";
    } else {
      return el.innerHTML = value;
    }
  };

  HexaFlip.prototype._setSides = function(cube) {
    var bottomAdj, faceOffset, offset, set, setLength, setOffset, topAdj;
    cube.el.style[css.transform] = this._getTransform(cube.yDelta, cube.xDelta);
    cube.offset = offset = Math.floor(cube.xDelta / 90);
    if (offset === cube.lastOffset) {
      return;
    }
    cube.lastOffset = faceOffset = setOffset = offset;
    set = this.sets[cube.set];
    setLength = set.length;
    if (offset < 0) {
      faceOffset = setOffset = ++offset;
      if (offset < 0) {
        if (-offset > setLength) {
          setOffset = setLength - -offset % setLength;
          if (setOffset === setLength) {
            setOffset = 0;
          }
        } else {
          setOffset = setLength + offset;
        }
        if (-offset > 4) {
          faceOffset = 4 - -offset % 4;
          if (faceOffset === 4) {
            faceOffset = 0;
          }
        } else {
          faceOffset = 4 + offset;
        }
      }
    }
    if (setOffset >= setLength) {
      setOffset %= setLength;
    }
    if (faceOffset >= 4) {
      faceOffset %= 4;
    }
    topAdj = faceOffset - 1;
    bottomAdj = faceOffset + 1;
    if (topAdj === -1) {
      topAdj = 3;
    }
    if (bottomAdj === 4) {
      bottomAdj = 0;
    }
    this._setContent(cube[faceSequence[topAdj]], set[setOffset - 1] || set[setLength - 1]);
    return this._setContent(cube[faceSequence[bottomAdj]], set[setOffset + 1] || set[0]);
  };

  HexaFlip.prototype._onTouchStart = function(e, cube) {
    e.preventDefault();
    cube.touchStarted = true;
    e.currentTarget.classList.add('no-tween');
    if (e.type === 'mousedown') {
      cube.y = e.pageY;
      return cube.x = e.pageX;
    } else {
      cube.y = e.touches[0].pageY;
      return cube.x = e.touches[0].pageX;
    }
  };

  HexaFlip.prototype._onTouchMove = function(e, cube) {
    if (!cube.touchStarted) {
      return;
    }
    e.preventDefault();
    cube.yDiff = (e.pageY - cube.y) * this.touchSensitivity;
    cube.xDiff = (e.pageX - cube.x) * this.touchSensitivity;
    cube.yDelta = cube.yLast - cube.yDiff;
    cube.xDelta = cube.xLast - cube.xDiff;
    return this._setSides(cube);
  };

  HexaFlip.prototype._onTouchEnd = function(e, cube) {
    var mod;
    cube.touchStarted = false;
    mod = cube.yDelta % 90;
    if (mod < 45) {
      cube.yLast = cube.yDelta + mod;
    } else {
      if (cube.yDelta > 0) {
        cube.yLast = cube.yDelta + mod;
      } else {
        cube.yLast = cube.yDelta - (90 - mod);
      }
    }
    if (cube.yLast % 90 !== 0) {
      cube.yLast -= cube.yLast % 90;
    }
    mod = cube.xDelta % 90;
    if (mod < 45) {
      cube.xLast = cube.xDelta + mod;
    } else {
      if (cube.xDelta > 0) {
        cube.xLast = cube.xDelta + mod;
      } else {
        cube.xLast = cube.xDelta - (90 - mod);
      }
    }
    if (cube.xLast % 90 !== 0) {
      cube.xLast -= cube.xLast % 90;
    }
    cube.el.classList.remove('no-tween');
    return cube.el.style[css.transform] = this._getTransform(cube.yLast, cube.xLast);
  };

  HexaFlip.prototype._onTouchLeave = function(e, cube) {
    if (!cube.touchStarted) {
      return;
    }
    return this._onTouchEnd(e, cube);
  };

  HexaFlip.prototype._onMouseOut = function(e, cube) {
    if (!cube.touchStarted) {
      return;
    }
    if (e.toElement && !cube.el.contains(e.toElement)) {
      return this._onTouchEnd(e, cube);
    }
  };

  HexaFlip.prototype.setValue = function(settings) {
    var cube, index, key, results, value;
    results = [];
    for (key in settings) {
      value = settings[key];
      if (!(this.sets[key] && !this.cubes[key].touchStarted)) {
        continue;
      }
      value = value.toString();
      cube = this.cubes[key];
      index = this.sets[key].indexOf(value);
      cube.yDelta = cube.yLast = 90 * index;
      this._setSides(cube);
      results.push(this._setContent(cube[faceSequence[index % 4]], value));
    }
    return results;
  };

  HexaFlip.prototype.getValue = function() {
    var cube, offset, ref1, results, set, setLength;
    ref1 = this.cubes;
    results = [];
    for (set in ref1) {
      cube = ref1[set];
      set = this.sets[set];
      setLength = set.length;
      offset = cube.yLast / 90;
      if (offset < 0) {
        if (-offset > setLength) {
          offset = setLength - -offset % setLength;
          if (offset === setLength) {
            offset = 0;
          }
        } else {
          offset = setLength + offset;
        }
      }
      if (offset >= setLength) {
        offset %= setLength;
      }
      if (typeof set[offset] === 'object') {
        results.push(set[offset].value);
      } else {
        results.push(set[offset]);
      }
    }
    return results;
  };

  HexaFlip.prototype.flip = function(back) {
    var cube, delta, ref1, results, set;
    delta = back ? -90 : 90;
    ref1 = this.cubes;
    results = [];
    for (set in ref1) {
      cube = ref1[set];
      if (cube.touchStarted) {
        continue;
      }
      cube.yDelta = cube.yLast += delta;
      results.push(this._setSides(cube));
    }
    return results;
  };

  HexaFlip.prototype.flipBack = function() {
    return this.flip(true);
  };

  return HexaFlip;

})();

if ((window.jQuery != null) || (((ref1 = window.$) != null ? ref1.data : void 0) != null)) {
  $.fn.hexaFlip = function(sets, options) {
    var args, el, instance, k, l, len1, len2, methodName;
    if (!css.transform) {
      return this;
    }
    if (typeof sets === 'string') {
      methodName = sets;
      if (typeof HexaFlip.prototype[methodName] !== 'function') {
        return this;
      }
      for (k = 0, len1 = this.length; k < len1; k++) {
        el = this[k];
        if (!(instance = $.data(el, baseName))) {
          return;
        }
        args = Array.prototype.slice.call(arguments);
        args.shift();
        instance[methodName](args);
      }
      return this;
    } else {
      for (l = 0, len2 = this.length; l < len2; l++) {
        el = this[l];
        if (instance = $.data(el, baseName)) {
          return instance;
        } else {
          $.data(el, baseName, new HexaFlip(el, sets, options));
        }
      }
    }
  };
}
