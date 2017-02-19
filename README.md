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
new Slider(options);
```

##配置

以下默认配置
``` options
{
  ele: '.s-main',//绑定的dom,可以是class，id或者dom对象
  showColor: '#00bcd4',//滑杆块颜色
  bgColor: '#bdbdbd',//滑杆背景颜色
  hoverBgColor: 'rgba(189,189,189,.2)',//滑杆块value小于0的hover效果背景颜色
  hoverColor: 'rgba(0,188,212,.2)',//滑杆块value大于0的hover效果背景颜色
  value: 0,//滑杆的值
  step: 1,//设置滑杆的移动间距
  max: 100,//设置滑杆最大值
  isHover: true,//是否启动hover效果
  isBtn: true,//是否启动控制滑块
  callback: function(value){}//滑动过程中的回调函数，value为滑杆的值
}
```
new Slider()返回的实例属性value是滑杆的值，也可以设置vlaue属性值

##说明

前端新人,大神轻喷
