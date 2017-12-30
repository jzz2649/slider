/**
 * @slider.js
 * @author jiangzhongzheng
 * @version1.0
 * @description 拉杆
 */

function Slider (node, option) {
  if (typeof node === 'undefined') {
    throw new Error('node not is Element');
  }

  this.el = {node: node};

  var defaultOption = {
    value: 0,
    step: 1,
    max: 100,
    bgColor: '#bdbdbd',
    showColor: '#00bcd4',
    hoverColor: 'rgba(0,188,212,.2)',
    btnW: 12,
    btnH: 12,
    sliderH: 2,
    clickH: 18,
    radius: '50%',
    isHover: true,
    isBtn: true,
    slider: true,
    change: function(){},
    callback: function(){}
  }

  Object.defineProperty(this, 'value', {
    get: function () {
      return this.state.position * this.option.max / 100;
    },
    set: function (v) {
      this.slider(v);
    }
  })

  this.option = Slider.assign(defaultOption, option);
  this.createState();
  this.createElement();
  this.addEvent();
}

Slider.prototype.createState = function () {
  var value = this.option.value;
  var max = this.option.max;
  var step = this.option.step;
  var clientRect = Slider.getClientRect(this.el.node);
  var left = clientRect.left;
  var width = clientRect.width;
  var ratio = 100 / max;
  var space = step * ratio;
  var position = value * ratio;
  var isClick = false;
  var isEnter = false;
  this.state = { left: left, width: width, ratio: ratio, space: space, position: position, isClick: isClick, isEnter: isEnter };
}

Slider.prototype.createElement = function() {
    var styleTmp = function(w, h, bgColor, addStr) {
      var addStr = addStr || '';
      var tmp = 'position:absolute;width:'+w+';height:'+h+';background:'+bgColor+';-webkit-user-select: none;-webkit-user-drag: none;user-select: none;'+addStr;
      return tmp;
    }
    var bgColor = this.option.bgColor;
    var hoverColor = this.option.hoverColor;
    var showColor = this.option.showColor;
    var max = this.option.max;
    var radius = this.option.radius;
    var btnW = this.option.btnW;
    var btnH = this.option.btnH;
    var sliderH = this.option.sliderH;
    var clickH = this.option.clickH;
    var position = this.state.position;
    var width = this.state.width;
    var node = this.el.node;
    var btnLeft = position;
    var _clickH = sliderH > clickH ? sliderH : clickH;
    var boxTop = (_clickH - sliderH) / 2;
    var top = (sliderH - 2) / 2;
    var box = Slider.createEle('div',
      styleTmp('100%', sliderH+'px', bgColor, 'top:'+boxTop+'px;left: 0px;'));
    var bar = Slider.createEle('span',
      styleTmp('100%', sliderH+'px', showColor, 'left: 0px;transform-origin:left;transform: scaleX('+(position/100)+');'));
    var barBg = Slider.createEle('span',
      styleTmp('100%', sliderH+'px', bgColor, 'right: 0px;transform-origin:right;transform: scaleX('+((100-position)/100)+');'));
    var btn = Slider.createEle('i',
        styleTmp(btnW+'px', btnH+'px', showColor, 'top:'+top+'px;left:'+btnLeft+'%;cursor: pointer;margin-top: 1px;border-radius: '+radius+';transform: translate(-50%,-50%) scale(1);'));
    var hover = Slider.createEle('span',
      styleTmp('100%','100%', 'transparent','transform: scale(1); transition: transform .1s linear 0s; background-color: '+hoverColor+'; border-radius:'+radius+';'));
    var hoverScale = Slider.createEle('span',
      styleTmp('100%', '100%', hoverColor,'top:0;left:0;border-radius: +'+radius+';transition: transform 0.1s linear 0s;'));
    var body = Slider.createEle('div', 
      styleTmp('100%', _clickH+'px', 'transparent','position: relative'));
    this.el = Slider.assign(this.el, {body: body, box: box, bar: bar, barBg: barBg, btn: btn, hover: hover, hoverScale: hoverScale});
  }

Slider.prototype.addEvent = function() {
  var me = this;
  var node = this.el.node;
  var body = this.el.body;
  var box = this.el.box;
  var bar = this.el.bar;
  var barBg = this.el.barBg;
  var btn = this.el.btn;
  var hover = this.el.hover;
  var hoverScale = this.el.hoverScale;
  var isBtn = this.option.isBtn;
  var isHover = this.option.isHover;
  var slider = this.option.slider;
  var change = this.option.change;
  var isEnter = this.state.isEnter;
  box.appendChild(bar);
  box.appendChild(barBg);
  body.appendChild(box);
  node.appendChild(body);

  var getEvent = function(e) {
    return e.touches ? e.touches[0] : e;
  }
  var ondown = 'touchstart mousedown';
  var onmove = 'touchmove mousemove';
  var onend = 'touchend mouseup';
  var onenter = 'touchstart mouseenter';
  var onleave = 'touchend mouseleave';

  if (isBtn) box.appendChild(btn);
  if (isHover) {
    hover.appendChild(hoverScale);
    btn.appendChild(hover);
    Slider.on(body, onenter, function() {
      me.state.isEnter = true;
      hoverScale.style.transform = 'scale(2)';
    })

    Slider.on(body, onleave, function() {
      me.state.isEnter = false;
      hoverScale.style.transform = 'scale(1)';
    })
  }
  if (!slider) return;
  
  Slider.on(body, ondown, function(e) {
    var event = getEvent(e);
    var clientX = event.clientX;
    var clientRect = Slider.getClientRect(node);
    var left = clientRect.left;
    var width = clientRect.width;
    me.state.left = left;
    me.state.width = width;
    me.state.isClick = true;
    me.handleSlider(clientX);
  })
  var prevValue = this.value;
  Slider.on(window, onend, function() {
    var isClick = me.state.isClick;
    if (isClick) {
      me.state.isClick = false;
      if(prevValue !== me.value) {
        prevValue = me.value;
        change(me.value);
      }
    }
  })

  Slider.on(window, onmove, function(e) {
    var isClick = me.state.isClick;
    if (isClick) {
      var event = getEvent(e);
      var clientX = event.clientX;
      me.handleSlider(clientX);
    }
  })
}

Slider.prototype.handleSlider = function(clientX) {
  var max = this.option.max;
  var left = this.state.left;
  var width = this.state.width;
  var value = (clientX - left) * max / width;
  this.slider(value);
}

Slider.prototype.slider = function(value) {
  var max = this.option.max;
  var position = this.state.position;
  var space = this.state.space;
  var distance = value / max * 100;
  var range = Math.round(Math.abs((distance - position) / space));

  if (range < 1) return;

  if (distance > position && position < 100) {
    for (var i = 0; i < range; i++) {
      if (this.state.position >= 100) return;
      this.comPosition(Math.round(space * max));
    }
  } else if (distance < position && position > 0) {
    for (var i = 0; i < range; i++) {
      if (this.state.position <= 0) return;
      this.comPosition(-Math.round(space * max));
    }
  }
}

Slider.prototype.comPosition = function(slider) {
  var max = this.option.max;
  var position = this.state.position;
  this.state.position = Math.floor(Math.round(position * max) + slider) / max;
  this._dom();
}

Slider.prototype._dom = function() {
  var max = this.option.max;
  var callback = this.option.callback;
  var position = this.state.position;
  var width = this.state.width;
  var btn = this.el.btn;
  var bar = this.el.bar;
  var barBg = this.el.barBg;
  var btnLeft = position;
  btn.style.left = btnLeft+'%';
  bar.style.transform = 'scaleX('+(position/100)+')';
  barBg.style.transform = 'scaleX('+((100 - position)/100)+')';
  callback(this.value);
}

Slider.prototype.setMax = function(v, state) {
  var max = this.option.max;
  var step = this.option.step;
  if (v !== max) {
    var _value = this.value;
    this.option.max = v;
    this.state.ratio = 100 / v;
    this.state.space = step * this.state.ratio;
    this.value = 0;
    if (state) this.value = _value;
  }
}

Slider.assign = function (obj, cp) {
  var o = {};
  for (var k in obj) {
    o[k] = obj[k];
  }
  for (var ck in cp) {
    o[ck] = cp[ck];
  }
  return o;
}

Slider.createEle = function (targetName, style) {
  var ele = document.createElement(targetName);
  ele.style.cssText = style;
  return ele;
}

Slider.getClientRect = function (node) {
  return node.getBoundingClientRect();
}

Slider.on = function (obj, type, callback) {
  var arr = type.split(' ');
  for(var i = 0; i < arr.length; i++){
    obj.addEventListener(arr[i], callback);
  }
}
