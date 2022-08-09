// 定义自定义指令
export const imgError = {
  inserted(el, options) {
    el.onerror = function() {
      el.src = options.value
    }
  }
}
