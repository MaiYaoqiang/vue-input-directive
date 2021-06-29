const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
const compositionstart = (e) => {
  e.target.composing = true
}
const compositionend = (e) => {
  e.target.composing = false
  trigger(e.target, 'input')
}
let initId = 0
const DInitFun = function (handler) {
  const id = initId++
  const bindFun = (el, binding) => {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    // 把一些信息存起来 用于判断是否需要重新绑定事件
    // 因为每次输入的时候都会触发指令的update 重复绑定没意义
    if (!ele[id]) {
      ele[id] = {
        oldCallback: null,
        oldValue: null,
      }
    }
    const oldData = ele[id]
    const value = binding.value?.toString() || undefined
    if (oldData.oldValue !== value) {
      oldData.oldValue = value
      if (oldData.oldCallback) {
        ele.removeEventListener('keyup', oldData.oldCallback)
        ele.removeEventListener('blur', oldData.oldCallback)
        ele.removeEventListener('compositionstart', compositionstart)
        ele.removeEventListener('compositionend', compositionend)
      }
      const callback = (e) => {
        if (!e.target.composing) {
          handler(ele, binding)
          // 不加Trigger会导致输入完 blur后数据变化
          trigger(ele, 'input')
        }
      }
      ele.addEventListener('keyup', callback)
      ele.addEventListener('blur', callback)
      ele.addEventListener('compositionstart', compositionstart)
      ele.addEventListener('compositionend', compositionend)
      oldData.oldCallback = callback
    }
  }
  return {
    mounted: bindFun,
    updated: bindFun,
    inserted: bindFun,
    update: bindFun,
  }
}

// 输入数字限制最大值
/**
 * @example
 <el-input
 v-d-input-max="99.99"
 v-model="value"></el-input>
 */
const DInputMax = (ele, binding) => {
  let value = ele.value + ''
  if (parseFloat(value) > parseFloat(binding.value)) {
    value = binding.value
  }
  ele.value = value
}

/**
 * @example
 <el-input
 v-d-input-int
 v-d-input-max="9999"
 v-model="value"></el-input>
 */
// 只能输入正整数
const DInputInt = (ele, binding) => {
  let value = ele.value + ''
  const reg = /[1-9]{1}\d*/
  const matchRes = value.match(reg)
  if (matchRes) {
    value = matchRes[0]
  } else {
    value = ''
  }
  ele.value = value
}

/**
 * @example
 <el-input
 v-d-input-point2
 v-d-input-max="99.99"
 v-model="value"></el-input>
 */
// 只能输入两位小数
const DInputPoint2 = (ele, binding) => {
  let value = ele.value + ''
  const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  const regSome = /[0-9]+\.?[0-9]{0,2}/// 两位小数输入部分时的限制规则
  const matchRes = value.match(reg)
  if (matchRes) {
    // 符合 不需要做删减操作
  } else {
    // 若不符合 看是否符合部分
    const matchResSome = value.match(regSome)
    if (matchResSome) {
      value = matchResSome[0]
    } else {
      value = ''
    }
  }
  ele.value = value
}

// 只能输入英文 大小写
const DInputEn = (ele, binding) => {
  let value = ele.value + ''
  const reg = /[a-zA-Z]*/
  const matchRes = value.match(reg)
  if (matchRes) {
    value = matchRes[0]
  } else {
    value = ''
  }
  ele.value = value
}

/**
 * @example
 <el-input
 v-d-input-regexp="/[0-9]{0,18}/"
 v-model="value"></el-input>
 */
// 限制不能输入中文v-d-input-regexp="/((?![\u4E00-\u9FA5]).)*/"
// 仅可输入数字字母v-d-input-regexp="/[0-9A-Za-z]*/"
const DInputRegexp = (ele, binding) => {
  let value = ele.value + ''
  const reg = binding.value
  const matchRes = value.match(reg)
  if (matchRes) {
    value = matchRes[0]
  } else {
    value = ''
  }
  ele.value = value
}

export {
  DInitFun,
}
export default (Vue) => {
  Vue.directive('d-input-max', DInitFun(DInputMax))
  Vue.directive('d-input-int', DInitFun(DInputInt))
  Vue.directive('d-input-point2', DInitFun(DInputPoint2))
  Vue.directive('d-input-en', DInitFun(DInputEn))
  Vue.directive('d-input-regexp', DInitFun(DInputRegexp))
}
