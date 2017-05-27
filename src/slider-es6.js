/**
 * @slider.js
 * @author jiangzhongzheng
 * @version1.0
 * @description 拉杆
 */

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "Slider" }] */

class Slider {
  constructor (options) {
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

    this._init()
  }

  static type (obj) {
    return Object.prototype.toString.call(obj)
  }

  static isArray (array) {
    if (Array.isArray) {
      return Array.isArray(array)
    } else {
      return this.type(array) === '[object Array]'
    }
  }

  static isObject (obj) {
    return this.type(obj) === '[object Object]'
  }

  static createEle (targetName, style) {
    var ele = document.createElement(targetName)

    if (style) {
      this.cssText(ele, style)
    }

    return ele
  }

  static cssText (ele, style) {
    ele.style.cssText = style
  }

  static on (obj, events, callback) {
    var event = events.split(' ')
    var len = event.length
    var i = 0

    var isSupportTouch = 'ontouchstart' in document

    for (; i < len; i++) {
      if (isSupportTouch && ~(event[i].indexOf('mouse'))) {
        continue;
      }
      obj.addEventListener(event[i], (e) => {
        callback && callback(e)
      })
    }
  }

  _init () {
    this._box = Slider.createEle('div', 'position: absolute;top:8px;left:0px;width:100%;height: 2px;background: ' + this.options.bgColor + ';-webkit-user-select:none;user-select: none;')
    this.bar = Slider.createEle('span', 'position:absolute;left:0;height:2px;width: ' + this.position + '%;background:' + this.options.showColor + ';-webkit-user-select:none;user-select:none;')
    this.barBg = Slider.createEle('span',
        'position: absolute;right: 0; height: 2px; width: ' + (100 - this.position) + '%; background-color:' + this.options.bgColor + ';-webkit-user-select:none; user-select: none;')
    Slider.cssText(this.ele, 'position: relative;height: 18px;-webkit-user-select:none;user-select: none;')

    Object.defineProperty(this, 'value', {
      set (v) {
        this.slider(v)
      },
      get () {
        return this._value
      }
    })

    this.options.callback(this.options.value)

    this._box.appendChild(this.bar)
    this._box.appendChild(this.barBg)
    this.ele.appendChild(this._box)

    this.bind()
  }

  bind () {
    if (this.options.isBtn) {
      this.btn = Slider.createEle('i', 'position: absolute;top: 0px; left: ' + this.position + '%; margin-top: 1px; width: 12px; height: 12px; border-radius: 50%; transform: translate(-50%,-50%) scale(1); transition: transform .1s linear 0s; background-color: ' + this.options.showColor + '; cursor: pointer;-webkit-user-select:none; user-select: none;')
      this._box.appendChild(this.btn)

      Slider.on(this.ele, 'mousedown touchstart', (e) => {
        var clientX = e.touches ? e.touches[0].clientX : e.clientX
        this.isClick = true
        this.box = this.ele.getBoundingClientRect()
        this.left = this.box.left
        this.width = this.box.width

        if (!e.touches && this.options.isHover) {
          this._btnBox.style.transform = 'scale(0.5)'
        }

        this.btn.style.transform = 'translate(-50%, -50%) scale(1.5)'
        this._slider(clientX)
      })

      Slider.on(window, 'mouseup touchend', (e) => {
        if (this.isClick) {
          if (this.options.isHover) {
            if (!e.touches) {
              this.isEnter && (this.btnHover.style.transform = 'scale(2)')
              this._btnBox.style.transform = 'scale(1)'
            } else {
              this.btnHover.style.transform = 'scale(1)'
            }
          }

          this.btn.style.transform = 'translate(-50%, -50%) scale(1)'
          this.isClick = false
        }
      })

      Slider.on(window, 'mousemove touchmove', (e) => {
        var clientX

        if (this.isClick) {
          clientX = e.touches ? e.touches[0].clientX : e.clientX
          this._slider(clientX)
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

      Slider.on(this.ele, 'mouseenter', () => {
        this.isEnter = true
        this.btnHover.style.transform = 'scale(2)'
      })

      Slider.on(this.ele, 'mouseleave', () => {
        this.isEnter = false
        this.btnHover.style.transform = 'scale(1)'
      })
    }

    if (this.btn) {
      if (this.position === 0) {
        this.btn.style.background = this.options.bgColor
        this.btnHover && (this.btnHover.style.background = this.options.hoverBgColor)
      }
    }
  }

  _slider (clientX) {
    var value = (clientX - this.left) * this.options.max / this.width
    this.slider(value)
  }

  slider (value) {
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

  _dom (slider) {
    var prveState = this.value
    this.position = Math.floor(Math.round(this.position * this.options.max) + slider) / this.options.max
    this._value = Math.floor(this.position * this.options.max / 100)
    this.btn && (this.btn.style.left = this.position + '%')
    this.bar.style.width = this.position + '%'
    this.barBg.style.width = 100 - this.position + '%'
    this.btn && this._watch(prveState)
    this.options.callback(this._value)
  }

  _watch (prveState) {
    if (this.value === 0) {
      this.btn.style.background = this.options.bgColor
      this.btnHover && (this.btnHover.style.background = this.options.hoverBgColor)
    } else if (prveState === 0) {
      this.btn.style.background = this.options.showColor
      this.btnHover && (this.btnHover.style.background = this.options.hoverColor)
    }
  }

  setMax (v, state) {
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
}
