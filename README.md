# slider
仿google material-ui拉杆

##使用示意

1. 引入js文件，例如

``` html
<script src="slider.js"></script>
```
2. 绑定dom(比如class为s-main)以及调用
``` html
<div class="s-main"></div>
```
``` javascript
new Slider(el, option);
```

##配置

以下默认配置
``` options
new Slider(
  document.querySelector('.s-main'),//绑定的dom,可以是class，id或者dom对象
  {
  showColor: '#00bcd4',//滑杆块颜色
  bgColor: '#bdbdbd',//滑杆背景颜色
  hoverBgColor: 'rgba(189,189,189,.2)',//滑杆块value小于0的hover效果背景颜色
  hoverColor: 'rgba(0,188,212,.2)',//滑杆块value大于0的hover效果背景颜色
  value: 0,//滑杆的值
  step: 1,//设置滑杆的移动间距
  max: 100,//设置滑杆最大值
  btnW: 12,//按钮的宽度
  btnH: 12,//按钮的高度
  sliderH: 2,//滑杆的高度
  clickH: 18,//滑杆点击事件高度
  radius: '50%',//按钮的圆角度
  slider: true,//是否启动控制
  isHover: true,//是否启动hover效果
  isBtn: true,//是否显示按钮
  change: function(value){},//放开鼠标或离开屏幕，如果值改变则触发
  callback: function(value){}//滑动过程中的回调函数，value为滑杆的值
})
```
##属性
new Slider()返回的实例属性包含value属性和setMax方法
```
value:可以获取设置value值
setMax(v, state):参数v(number)设置滑杆最大值，state(boolean)设置后是否保持原来的值
```
##说明

有问题，欢迎提出
