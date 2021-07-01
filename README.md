## codepen地址
https://codepen.io/maiyaoqiang/pen/rNmVNXa?editors=1010

# 用法

已兼容vue3.0
##
```
npm install vue-input-directive --save
```
```js
import Vue from 'vue'
import inputValidate from 'vue-input-directive'
Vue.use(inputValidate)
```

### 1.d-input-max
输入数字限制最大值
```html
 <el-input v-d-input-max="99.99" v-model="value"></el-input>
```

### 2.d-input-int
只能输入正整数
```html
 <el-input v-d-input-int v-model="value"></el-input>
```

### 3.d-input-point2
最多只能输入两位小数
```html
 <el-input v-d-input-point2 v-model="value"></el-input>
```

### 4.d-input-en
只能输入英文
```html
 <el-input v-d-input-en v-model="value"></el-input>
```

### 5.d-input-regexp
限制正则内容，输入时若正则部分匹配，则把匹配的部分留下，其余清空
实际上上面4种除了输入两位小数以外其他3个都可以用正则替代
```html
<!-- 限制不能输入中文 -->
 <el-input v-d-input-regexp="/((?![\u4E00-\u9FA5]).)*/" v-model="value"></el-input>
```
```html
<!-- 限制仅可输入数字字母 -->
 <el-input v-d-input-regexp="/[0-9A-Za-z]*/" v-model="value"></el-input>
```

### 6.混合使用
```html
<!-- 限制输入两位小数 最大可输入99.99 -->
 <el-input 
  v-d-input-point2
  v-d-input-max="99.99"
  v-model="value"></el-input>
```

### 7.自定义正则
只能输入数字和字母和中文
```js
import Vue from 'vue'
import {DInitFun} from 'vue-input-directive'
// 只能输入数字和字母
Vue.directive(
  'd-input-num-en',
  DInitFun((ele, binding) => {
      let value = ele.value + ''
      const reg = /[a-zA-Z0-9\u4E00-\u9FA5]*/
      const matchRes = value.match(reg)
      if (matchRes) {
        value = matchRes[0]
      } else {
        value = ''
      }
      ele.value = value
  })
)
```
