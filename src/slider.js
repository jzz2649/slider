/**
 * @slider.js
 * @author jiangzhongzheng
 * @version1.0
 * @description 拉杆
 */

function Slider (options) {
  this.options = {
    ele: '.s-main',
    showColor: '#00bcd4',
    bgColor: '#bdbdbd',
    hoverBgColor: 'rgba(189,189,189,.2)',
    hoverColor: 'rgba(0,188,212,.2)',
    value: 0,
    step: 1,
    max: 100,
    isHover: true,
    isBtn: true,
    change: function() { },
    callback: function () { }
  }

  this.isClick = false
  this.isEnter = false
  this.ele

  for (var o in options) {
    this.options[o] = options[o]
  }

  if (typeof this.options.ele === 'string') {
    this.ele = document.querySelector(this.options.ele)
  } else {
    this.ele = this.options.ele
  }

  this.box = this.ele.getBoundingClientRect()
  this.left = this.box.left
  this.width = this.box.width
  this.ratio = 100 / this.options.max
  this.space = this.options.step * this.ratio
  this.position = this.options.value * this.ratio
  this._value = this.options.value
  this.beforeChangeValue = this.options.value

  this._init()
}

Slider.prototype._init = function () {
  this._box = Slider.createEle('div', 'position: absolute;top:8px;left:0px;width:100%;height: 2px;background: ' + this.options.bgColor + ';-webkit-user-select:none;user-select: none;')
  this.bar = Slider.createEle('span', 'position:absolute;left:0;height:2px;width: ' + this.position + '%;background:' + this.options.showColor + ';-webkit-user-select:none;user-select:none;')
  this.barBg = Slider.createEle('span',
      'position: absolute;right: 0; height: 2px; width: ' + (100 - this.position) + '%; background-color:' + this.options.bgColor + ';-webkit-user-select:none; user-select: none;')
  Slider.cssText(this.ele, 'position: relative;height: 18px;-webkit-user-select:none;user-select: none;')

  Object.defineProperty(this, 'value', {
    set: function (v) {
      this.slider(v)
    },
    get: function () {
      return this._value
    }
  })

  this.options.callback(this.options.value)

  this._box.appendChild(this.bar)
  this._box.appendChild(this.barBg)
  this.ele.appendChild(this._box)

  this.bind()
}

Slider.prototype.bind = function () {
  var self = this

  if (this.options.isBtn) {
    this.btn = Slider.createEle('i', 'position: absolute;top: 0px; left: ' + this.position + '%; margin-top: 1px; width: 12px; height: 12px; border-radius: 50%; transform: translate(-50%,-50%) scale(1); transition: transform .1s linear 0s; background-color: ' + this.options.showColor + '; cursor: pointer;-webkit-user-select:none; user-select: none;')
    this._box.appendChild(this.btn)

    Slider.on(this.ele, 'mousedown touchstart', function (e) {
      var clientX = e.touches ? e.touches[0].clientX : e.clientX
      self.isClick = true
      self.box = self.ele.getBoundingClientRect()
      self.left = self.box.left
      self.width = self.box.width

      if (!e.touches && self.options.isHover) {
        self._btnBox.style.transform = 'scale(0.5)'
      }

      self.btn.style.transform = 'translate(-50%, -50%) scale(1.5)'
      self._slider(clientX)
    })

    Slider.on(window, 'mouseup touchend', function (e) {
      if (self.isClick) {
        if (self.options.isHover) {
          if (!e.touches) {
            self.isEnter && (self.btnHover.style.transform = 'scale(2)')
            self._btnBox.style.transform = 'scale(1)'
          } else {
            self.btnHover.style.transform = 'scale(1)'
          }
        }

        self.btn.style.transform = 'translate(-50%, -50%) scale(1)'
        self.isClick = false
        if(self.value !== self.beforeChangeValue) {
          self.beforeChangeValue = self.value
          self._changeFn(self.value)
        }
      }
    })

    Slider.on(window, 'mousemove touchmove', function (e) {
      var clientX

      if (self.isClick) {
        clientX = e.touches ? e.touches[0].clientX : e.clientX
        self._slider(clientX)
      }
    })
  } else {
    return
  }

  if (this.options.isHover) {
    this.btnHover = Slider.createEle('span', 'position: absolute; width: 100%; height: 100%; transform: scale(1); transition: transform .1s linear 0s; background-color:' + this.options.hoverColor + '; border-radius: 50%;-webkit-user-select:none; user-select: none;')
    this._btnBox = Slider.createEle('span', 'position:absolute;top:0;left:0;width:100%;height:100%;transition: transform 0.1s linear 0s;')
    this._btnBox.appendChild(this.btnHover)
    this.btn.appendChild(this._btnBox)

    Slider.on(this.ele, 'mouseenter', function (e) {
      self.isEnter = true
      self.btnHover.style.transform = 'scale(2)'
    })

    Slider.on(this.ele, 'mouseleave', function (e) {
      self.isEnter = false
      self.btnHover.style.transform = 'scale(1)'
    })
  }

  if (this.btn) {
    if (this.position === 0) {
      this.btn.style.background = this.options.bgColor
      this.btnHover && (this.btnHover.style.background = this.options.hoverBgColor)
    }
  }
}

Slider.prototype._changeFn = function(value){
  this.options.change && this.options.change(value)
}

Slider.prototype._slider = function (clientX) {
  var value = (clientX - this.left) * this.options.max / this.width
  this.slider(value)
}

Slider.prototype.slider = function (value) {
  var distance = value / this.options.max * 100
  var range = Math.round(Math.abs((distance - this.position) / this.space))
  var i = 0

  if (range < 1) {
    return
  }

  if (distance > this.position && this.position < 100) {
    for (; i < range; i++) {
      if (this.position >= 100) {
        return
      }

      this._dom(Math.round(this.space * this.options.max))
    }
  } else if (distance < this.position && this.position > 0) {
    for (; i < range; i++) {
      if (this.position <= 0) {
        return
      }
      this._dom(-Math.round(this.space * this.options.max))
    }
  }
}

Slider.prototype._dom = function (slider) {
  var prveState = this.value
  this.position = Math.floor(Math.round(this.position * this.options.max) + slider) / this.options.max
  this._value = Math.floor(this.position * this.options.max / 100)
  this.btn && (this.btn.style.left = this.position + '%')
  this.bar.style.width = this.position + '%'
  this.barBg.style.width = 100 - this.position + '%'
  this.btn && this._watch(prveState)
  this.options.callback(this._value)
}

Slider.prototype._watch = function (prveState) {
  if (this.value === 0) {
    this.btn.style.background = this.options.bgColor
    this.btnHover && (this.btnHover.style.background = this.options.hoverBgColor)
  } else if (prveState === 0) {
    this.btn.style.background = this.options.showColor
    this.btnHover && (this.btnHover.style.background = this.options.hoverColor)
  }
}

Slider.prototype.setMax = function (v, state) {
  if (v !== this.options.max) {
    var status = this.value
    this.value = this.value * v / this.options.max
    this.options.max = v
    this.ratio = 100 / this.options.max
    this.space = this.options.step * this.ratio
    this.value = 0
    this.position = 0
    if (state) {
      this.value = status
    }
  }
}

Slider.type = function (obj) {
  return Object.prototype.toString.call(obj)
}

Slider.isArray = function (array) {
  if (Array.isArray) {
    return Array.isArray(array)
  } else {
    return Slider.type(array) === '[object Array]'
  }
}

Slider.isObject = function (obj) {
  return Slider.type(obj) === '[object Object]'
}

Slider.createEle = function (targetName, style) {
  var ele = document.createElement(targetName)

  if (style) {
    Slider.cssText(ele, style)
  }

  return ele
}

Slider.cssText = function (ele, style) {
  ele.style.cssText = style
}

Slider.on = function (obj, events, callback) {
  var event = events.split(' ')
  var len = event.length
  var i = 0

  for (; i < len; i++) {
    obj.addEventListener(event[i], function (e) {
      callback && callback(e)
    })
  }
}
