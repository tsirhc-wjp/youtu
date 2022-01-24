$('#panelRegister').hide()

// 点击注册按钮
$('#btnRegister').click(function () {
  $('#panelLogin').hide()
  $('#panelRegister').show()
})

// 点击登陆按钮
$('#btnLogin').click(function () {
  $('#panelLogin').show()
  $('#panelRegister').hide()
})

// 登陆表单验证
$('#formLogin').validate({
  onBlur: true,
  onKeyup: true,
  sendForm: false,  // 禁用表单的action
  description: {
    email: {
      required: '邮箱不能为空!',
      pattern: '请输入正确的邮箱地址格式!'
    },
    pass: {
      required: '密码不能为空!',
      pattern: '密码只能为数字和字母且不能少于6位!'
    }
  },
  valid () {
    // console.log($(this).serialize())
    // http.get

    // 字符串 键=值&键=值
    // serialize() 是把表单的数据收集成 键=值&键=值
    // const postData = $(this).serialize()

    // 收集表单数据，[ {name: 'email', value: 'xxx@xxx.xxx'} ]
    // console.log($(this).serializeArray())

    // 我们想要的格式： {"email":"xxxy@xxx.xxx","password":"123456"}

    // console.log($(this).serializeObject())

    const postData = $(this).serializeObject()

    // 验证成功，发送ajax请求，实现登陆功能
    // 服务器在接收post数据的时候，接收的是JSON形式的字符串
    http
      .post('/auth/login', postData)
      .then(res => {
        // console.log(res.status)
        // console.log(res.data)
        
        const { success, data, message } = res.data
        // success 是登陆成功还是失败 true
        // data 登陆成功才有，是服务器返回的登陆成功后的凭证
        // message 登陆失败才有，失败的原因

        if (success) {
          // 要把凭证保存
          // 把token保存到本地存储中
          localStorage.setItem('token', data)
          // 提示
          Toastify({
            text: '登陆成功',
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()
          // 跳转到首页
          location.href = '/index.html'
        } else {
          // 提示失败的原因
          console.log('xxxx')
          console.log(Toastify)
          Toastify({
            text: message,
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()
        }
      })
      .catch(err => {
        Toastify({
          text: err.response?.data?.message || err,
          duration: 3000,
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast()
      })
  },
  invalid () {
    console.log('表单验证失败')
  }
})


// 注册表单验证
$('#formRegister').validate({
  onBlur: true,
  onKeyup: true,
  sendForm: false,  // 禁用表单的action
  description: {
    firstname: {
      required: 'firstname不能为空!',
      pattern: 'firstname只能为数字和字母且不能少于3位!'
    },
    lastname: {
      required: 'lastname不能为空!',
      pattern: 'lastname只能为数字和字母且不能少于3位!'
    }
  },
  valid () {
    // 发送请求，实现注册功能
    const postData = $(this).serializeObject()
    http
      .post('/auth/signup', postData)
      .then(res => {
        const { success, data, message } = res.data

        if (success) {
          // 注册成功

          // 保存凭证
          // 把token保存到本地存储中
          localStorage.setItem('token', data)
          // 提示
          Toastify({
            text: '注册成功',
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()
          // 跳转到首页
          location.href = '/index.html'

        } else {
          // 注册失败
          Toastify({
            text: message,
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()
        }

      })
      .catch(err => {
        Toastify({
          text: err.response?.data?.message || err,
          duration: 3000,
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast()
      })
  },
  invalid () {
  }
})