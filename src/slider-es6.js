/**
 * @slider.js
 * @author jiangzhongzheng
 * @version1.0
 * @description 拉杆
 */

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "Slider" }] */

class Slider {
  static createEle (targetName, style = '') {
    const ele = document.createElement(targetName);
    ele.style.cssText = style;
    return ele;
  }
  static getClientRect (node) {
    return node.getBoundingClientRect();
  }
  static on (obj, type, callback) {
    const arr = type.split(' ');
    arr.forEach(type=>addEventListener.call(obj, type, callback));
  }
  constructor (node, option) {
    if (typeof node === 'undefined') {
      throw new Error('node not is Element');
    }

    this.el = { node };

    const defaultOption = {
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
      change: () => {},
      callback: () => {}   
    };

    this.option = Object.assign({}, defaultOption, option);
    this.createState();
    this.createElement();
    this.addEvent();
  }

  get value () {
    return this.state.position * this.option.max / 100;
  }

  set value (v) {
    this.slider(v);
  }

  createState() {
    const { value, max, step } = this.option;
    const { node } = this.el;
    const { left, width } = Slider.getClientRect(node);
    const ratio = 100 / max;
    const space = step * ratio;
    const position = value * ratio;
    const isClick = false;
    const isEnter = false;
    this.state = { left, width, ratio, space, position, isClick, isEnter };
  }

  createElement() {
    const styleTmp = (w, h, bgColor, addStr = '') => {
      let tmp = `
        position: absolute;
        width: ${w};
        height: ${h};
        background: ${bgColor};
        -webkit-user-select: none;
        -webkit-user-drag: none;
        user-select: none;
        ${addStr}
      `;
      return tmp;
    }
    const { bgColor, hoverColor, showColor, max, radius, btnW, btnH, sliderH, clickH } = this.option;
    const { position, width } = this.state;
    const { node } = this.el;
    const btnLeft = position;
    const _clickH = sliderH > clickH ? sliderH : clickH;
    const boxTop = (_clickH - sliderH) / 2;
    const top = (sliderH - 2) / 2;
    const box = Slider.createEle('div',
      styleTmp('100%', `${sliderH}px`, bgColor, `top: ${boxTop}px;left: 0px;`));
    const bar = Slider.createEle('span',
      styleTmp('100%', `${sliderH}px`, showColor, `left: 0px;transform-origin:left;transform: scaleX(${position/100});`));
    const barBg = Slider.createEle('span',
      styleTmp('100%', `${sliderH}px`, bgColor, `right: 0px;transform-origin:right;transform: scaleX(${(100-position)/100});`));
    const btn = Slider.createEle('i',
        styleTmp(`${btnW}px`, `${btnH}px`, showColor, `top: ${top}px;left:${btnLeft}%;cursor: pointer;margin-top: 1px;border-radius: ${radius};transform: translate(-50%,-50%) scale(1);`));
    const hover = Slider.createEle('span',
      styleTmp('100%','100%', 'transparent',`transform: scale(1); transition: transform .1s linear 0s; background-color: ${hoverColor}; border-radius: ${radius};`));
    const hoverScale = Slider.createEle('span',
      styleTmp('100%', '100%', hoverColor,`top:0;left:0;border-radius: ${radius};transition: transform 0.1s linear 0s;`));
    const body = Slider.createEle('div', 
      styleTmp('100%', `${_clickH}px`, 'transparent','position: relative'));
    this.el = Object.assign({}, this.el, {body, box, bar, barBg, btn, hover, hoverScale});
  }

  addEvent() {
    const { node, body, box, bar, barBg, btn, hover, hoverScale } = this.el;
    const { isBtn, isHover, slider, change } = this.option;
    const { isEnter } = this.state;
    box.appendChild(bar);
    box.appendChild(barBg);
    body.appendChild(box);
    node.appendChild(body);

    const getEvent = e => e.touches ? e.touches[0] : e;
    const ondown = 'touchstart mousedown';
    const onmove = 'touchmove mousemove';
    const onend = 'touchend mouseup';
    const onenter = 'touchstart mouseenter';
    const onleave = 'touchend mouseleave';

    if (isBtn) box.appendChild(btn);
    if (isHover) {
      hover.appendChild(hoverScale);
      btn.appendChild(hover);
      Slider.on(body, onenter, e => {
        this.state.isEnter = true;
        hoverScale.style.transform = 'scale(2)'
      })

      Slider.on(body, onleave, e => {
        this.state.isEnter = false;
        hoverScale.style.transform = 'scale(1)'
      })
    }
    if (!slider) return;
    
    Slider.on(body, ondown, e => {
      const event = getEvent(e);
      const clientX = event.clientX;
      const { left, width } = Slider.getClientRect(node);
      this.state.left = left;
      this.state.width = width;
      this.state.isClick = true;
      this.handleSlider(clientX);
    })
    let prevValue = this.value;
    Slider.on(window, onend, e => {
      const { isClick } = this.state;
      if (isClick) {
        this.state.isClick = false;
        if(prevValue !== this.value) {
          prevValue = this.value;
          change(this.value);
        }
      }
    })

    Slider.on(window, onmove, e => {
      const { isClick } = this.state;
      if (isClick) {
        const event = getEvent(e);
        const clientX = event.clientX;
        this.handleSlider(clientX);
      }
    })
  }

  handleSlider (clientX) {
    const { max } = this.option;
    const { left, width } = this.state;
    const value = (clientX - left) * max / width;
    this.slider(value);
  }

  slider (value) {
    const { max } = this.option;
    const { position, space } = this.state;
    const distance = value / max * 100;
    const range = Math.round(Math.abs((distance - position) / space));

    if (range < 1) return;

    if (distance > position && position < 100) {
      for (let i = 0; i < range; i++) {
        if (this.state.position >= 100) return;
        this.comPosition(Math.round(space * max));
      }
    } else if (distance < position && position > 0) {
      for (let i = 0; i < range; i++) {
        if (this.state.position <= 0) return;
        this.comPosition(-Math.round(space * max));
      }
    }
  }

  comPosition (slider) {
    const { position } = this.state;
    const { max } = this.option;
    this.state.position = Math.floor(Math.round(position * max) + slider) / max;
    this._dom();
  }

  _dom () {
    const { position, width } = this.state;
    const { max, callback } = this.option;
    const { btn, bar, barBg } = this.el;
    const btnLeft = position;
    btn.style.left = `${btnLeft}%`;
    bar.style.transform = `scaleX(${position/100})`;
    barBg.style.transform = `scaleX(${(100 - position)/100})`;
    callback(this.value);
  }

  setMax (v, state) {
    const { max, step } = this.option;
    if (v !== max) {
      const _value = this.value;
      this.option.max = v;
      this.state.ratio = 100 / v;
      this.state.space = step * this.state.ratio;
      this.value = 0;
      if (state) this.value = _value;
    }
  }
}
