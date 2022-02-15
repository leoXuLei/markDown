## 其他的事件属性

鼠标的事件属性。

- onclick
- ondblclick
- onmousedown: 鼠标按下的瞬间触发，每次点击松开都会触发一次 onmousedown 和 onmouseup
- onmouseenter
- onmouseleave
- onmousemove
- onmouseout
- onmouseover
- onmouseup: 鼠标按下之后松开的瞬间触发
- onwheel

键盘的事件属性。

- onkeydown
- onkeypress
- onkeyup

焦点的事件属性。

- onblur
- onfocus

表单的事件属性。

- oninput
- onchange
- onsubmit
- onreset
- oninvalid
- onselect

触摸的事件属性。

- ontouchcancel
- ontouchend
- ontouchmove
- ontouchstart

拖动的事件属性分成两类：一类与被拖动元素相关，另一类与接收被拖动元素的容器元素相关。

被拖动元素的事件属性。

- ondragstart：拖动开始
- ondrag：拖动过程中，每隔几百毫秒触发一次
- ondragend：拖动结束

接收被拖动元素的容器元素的事件属性。

- ondragenter：被拖动元素进入容器元素。
- ondragleave：被拖动元素离开容器元素。
- ondragover：被拖动元素在容器元素上方，每隔几百毫秒触发一次。
- ondrop：松开鼠标后，被拖动元素放入容器元素。

`<dialog>`对话框元素的事件属性。

- oncancel
- onclose
