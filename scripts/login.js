$('#panelRegister').hide()

// 点击注册
$('#btnRegister').click(function () {
  $('#panelLogin').hide()
  $('#panelRegister').show()
})
// 点击登录 
$('#btnLogin').click(function () {
  $('#panelLogin').show()
  $('#panelRegister').hide()
})

// 登录表单验证    都是jquery插件提供的代码
$('#formLogin').validate({
  onBlur : true,
  onKeyup : true,
  sendForm : false,
  description: {
    email: {
      required: '邮箱不能为空',
      pattern : '请输入正确邮箱'
    },
    pass: {
      required: '密码不能为空',
      pattern: '密码只能为数字和字母组合且不能少于6位!'
    },
  },
  valid () {
    // 表单通过验证后执行该回调函数     
    // 获取用户在表单中填写的数据
    // console.log($(this).serialize())

    // const postData = $(this).serialize()   // 里面获取的是 字符串需要转换
    // $(this).serializeArray()                //  里面是对象 

    const postData = $(this).serializeObject()
    // 验证成功 发送ajax请求 实现登录跳转 http在另一个文件里
    http
      .post('/auth/login' , postData)
      .then(res =>{
        const { success , data , message} = res.data
        // success 是登录成功还是失败 true
        // data 是登录成功 服务器返回的凭证
        // message 登录失败时 显示失败原因
        if(success){
          // 保持凭证 把token保存到本地存储中
          localStorage.setItem('token', data)
          // 提示
          Toastify({
            text : '登录成功',
            duration : 3000
          }).showToast()
          // 跳转首页
          setTimeout(()=>{location.href = 'index.html'},1000)
          
        } else {
          Toastify({
            text : message,
            duration : 3000
          }).showToast()
        }
      })
      .catch(err =>{
        Toastify({
          text : err.reponse?.data?.message || err,
          duration : 3000
        }).showToast()
        console.log('网络请求失败')
      })
  },
  invalid () {
     // 表单未通过验证时执行该回调函数
    alert('账号或密码错误')
  }
})

// 注册 表单验证
$('#formRegister').validate({
  onBlur : true,
  onKeyup : true,
  sendForm : false,
  description: {
    firstname: {
      required: '邮箱不能为空',
      pattern : '字母和数字并不少于3位'
    },
    lastname: {
      required: '密码不能为空',
      pattern: '字母和数字并不少于3位'
    },
  },
  valid () {
    // 发送请求 实现功能
    const propsData = $(this).serializeObject()
    http
     .post('/auth/login' , postData)
     .then(res =>{
        const { success , data , message} = res.data
        if(success){
          // 注册成功
          // 保存凭证
          localStorage.setItem('token' , data)
          // 提示
          // 跳转首页
          setTimeout(()=>{location.href = 'index.html'},1000)
        } else {
          // 注册失败
          Toastify({
            text : message,
            duration : 3000
          }).showToast()
        }
     })
     .catch(err =>{
      Toastify({
        text : err.reponse?.data?.message || err,
        duration : 3000
      }).showToast()
      console.log('网络请求失败')
    })
  },
  invalid() {
  }
})