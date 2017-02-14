/**
 * @slider.js
 * @author jiangzhongzheng
 * @version1.0
 * @description 拉杆
 */

function Slider(options) {
  this.options = {
    ele: '.s-main',
    showColor: '#00bcd4',
    bgColor: '#bdbdbd',
    hoverBgColor: 'rgba(189,189,189,.2)',
    hoverColor: 'rgba(0,188,212,.2)',
    value: 0,
    callback: function(){}
  }

  this.on = false;
  this.ele;

  for (var o in options) {
    this.options[o] = options[o];
  }

  if (typeof this.options.ele === 'string') {
    this.ele = document.querySelector(this.options.ele);
  } else {
    this.ele = this.options.ele;
  }

  this.value = this.options.value;
  this.box = this.ele.getBoundingClientRect();
  this.left = this.box.left;
  this.width = this.box.width;
  this.step = this.width/100;
  this.position = this.options.value;
  this.value = this.position;

  this._init();
}

Slider.prototype._init = function() {
  var self = this;
  var _bgColor = this.position;

  var div = Slider.createEle('div', 'position: absolute;top:8px;left:0px;width:100%;height: 2px;-webkit-user-select:none;user-select: none;')
  var span1 = this.span1 = Slider.createEle('span', 
      'position:absolute;left:0;height:2px;width: '+this.position+'%;background:'+this.options.showColor+';-webkit-user-select:none;user-select:none;');
  var span2 = this.span2 = Slider.createEle('span',
      'position: absolute;right: 0; height: 2px; width: '+(100-this.position)+'%; background-color:'+this.options.bgColor+';-webkit-user-select:none; user-select: none;');
  var span3 = this.span3= Slider.createEle('span', 
      'position: absolute; width: 100%; height: 100%; transform: scale(1); transition: transform .1s linear 0s; background-color:'+this.options.hoverColor+'; border-radius: 50%;-webkit-user-select:none; user-select: none;');
  var i_span = this.i_span = Slider.createEle('span', 'position:absolute;top:0;left:0;width:100%;height:100%;transition: transform 0.1s linear 0s;')
  var i = this.i = Slider.createEle('i', 
      'position: absolute;top: 0px; left: '+this.position+'%; margin-top: 1px; width: 12px; height: 12px; border-radius: 50%; transform: translate(-50%,-50%) scale(1); transition: transform .1s linear 0s; background-color: #00bcd4; cursor: pointer;-webkit-user-select:none; user-select: none;');
  
  Slider.cssText(this.ele, 'position: relative;height: 18px;-webkit-user-select:none;user-select: none;');

  if (this.position === 0) {
    this.i.style.background = this.options.bgColor;
    this.span3.style.background = this.options.hoverBgColor;
  }

  this.options.callback(this.value);

  Object.defineProperty(this, 'watch', {
    set: function() {
      if (this.position === 0) {
        this.i.style.background = this.options.bgColor;
        this.span3.style.background = this.options.hoverBgColor;
        _bgColor = this.position;
      }else {
        if (!_bgColor) {
          this.i.style.background = this.options.showColor;
          this.span3.style.background = this.options.hoverColor;
          _bgColor = this.position;
        }
      }
    }
  })

  i_span.appendChild(span3)
  i.appendChild(i_span);
  div.appendChild(span1);
  div.appendChild(span2);
  div.appendChild(i);
  this.ele.appendChild(div);

  Slider.on(this.ele, 'mouseenter', function(e){
    self.span3.style.transform = 'scale(2)';
  });

  Slider.on(this.ele, 'mouseleave', function(e){
    self.span3.style.transform = 'scale(1)';
  });

  Slider.on(this.ele, 'mousedown touchstart', function(e) {
    var clientX = e.touches?e.touches[0].clientX:e.clientX;
    self.on = true;
    self.box = self.ele.getBoundingClientRect();
    self.left = self.box.left;
    self.width = self.box.width;
    self.step = self.width/100;
    if(!e.touches) {
      self.i_span.style.transform = 'scale(0.5)';
    }
    self.i.style.transform = 'translate(-50%, -50%) scale(1.5)';
    self._slider(clientX);
  });

  Slider.on(window, 'mouseup touchend', function(e){
    if (!e.touches) {
      self.span3.style.transform = 'scale(1)';
      if (self.on) {
        self.span3.style.transform = 'scale(2)';
      }
      self.i_span.style.transform = 'scale(1)';
    }else {
      self.span3.style.transform = 'scale(1)';
    }
    self.i.style.transform = 'translate(-50%, -50%) scale(1)';
    self.on = false;
  });

  Slider.on(window, 'mousemove touchmove', function(e){
    var clientX;
    if(self.on){
      clientX = e.touches?e.touches[0].clientX:e.clientX;
      self._slider(clientX);
    }
  })
}

Slider.prototype._slider = function(clientX) {
  var distance = Math.round((clientX - this.left)/this.step);
  var range = Math.abs(distance - this.position);
  var i = 0;
  if (distance > this.position && distance <= 100) {
    for (; i<range; i++) {
      this.watch = this.value = this.position +=1;
      this.i.style.left = this.position+'%';
      this.span1.style.width = distance+'%';
      this.span2.style.width = 100 - distance+'%';
      this.options.callback(this.value);
    }
  } else if (distance < this.position && distance >= 0) {
    for (; i<range; i++) {
      this.watch = this.value = this.position -= 1;
      this.i.style.left = this.position+'%';
      this.span1.style.width = distance+'%';
      this.span2.style.width = 100 - distance+'%';
      this.options.callback(this.value);
    }
  }
}

Slider.type = function(obj) {
  return toString.call(obj);
}

Slider.isArray = function(array) {
  if(Array.isArray){
    return Array.isArray(array);
  }else {
    return Slider.type(array) === '[object Array]';
  }
}

Slider.isObject = function(obj) {
  return Slider.type(obj) === '[object Object]';
}

Slider.createEle = function(targetName, style) {
  var ele = document.createElement(targetName);
  if (style) {
    Slider.cssText(ele, style);
  }
  return ele;
}

Slider.cssText = function(ele, style) {
    var re = /-(\w)/;
    var styles = style.split(';');
    var len = styles.length;
    var w, name , css, i = 0;

  if (ele.style.cssText !== undefined) {
    ele.style.cssText = style;
  } else {
    for (; i<len; i++) {
      if(!!styles[i]){
        css = styles[i].split(':');
        if (w = css[0].match(re)) {
          ele.style[css[0].replace(w[0],w[1].toUpperCase()).trim()] = css[1].trim();
        } else {
          ele.style[css[0].trim()] = css[1].trim();
        }
      }
    }
  }
}

Slider.on = function(obj, events, callback) {
  var event = events.split(' ');
  var len = event.length;
  var i = 0;

  for (; i<len; i++) {
    obj.addEventListener(event[i], function(e){
      callback&&callback(e);
    })
  }
}