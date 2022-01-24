if (window.dayjs) {
  // 注册dayjs的插件
  dayjs.extend(window.dayjs_plugin_relativeTime)
  
  // 设置模板引擎的过滤器
  template.defaults.imports.relativeTime = function (value) {
    return dayjs().to(dayjs(value))
  }
}

// utils 通用模块
// 可以把通用的函数放到这个js文件中

// 给jquery注册一个插件，收集表单数据，返回 {"email":"xxxy@xxx.xxx","password":"123456"}

$.fn.serializeObject = function () {
  // [ {name: 'email', value: 'xxx@xxx.xxx'} ]
  const arr = this.serializeArray()

  const obj = {}
  arr.forEach(item => {
    obj[item.name] = item.value
  })
  return obj
}

// $('表单').serializeObject()


// 把查询字符串解析成对象
function query(str) {
  // str ---》  ?id=xxx&name=xxxxx
  str = str.replace('?', '')
  const arr = str.split('&')
  const obj = {}
  arr.forEach(item => {
    // item --> id=xxx
    const tmpArr = item.split('=')
    if (tmpArr.length === 2) {
      let key = tmpArr[0]
      let value = tmpArr[1]
      obj[key] = value
    }
  })
  return obj
}