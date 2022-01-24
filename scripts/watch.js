// 判断当前是否登陆，如果没有登陆跳转到登陆页面
const token = localStorage.getItem('token')
if (!token) {
  Toastify({
    text: '请先登陆',
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    destination: '/login.html',
    callback () {
      // 当显示的层消失的时候执行
      location.href = '/login.html'
    }
  }).showToast()
}

let queryObj = query(location.search)

// 发送请求获取数据
// 加载视频详情
function loadData () {
  http
    .get(`/videos/${queryObj.id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      const { success, data } = res.data
      if (success) {
        // 1. 播放当前视频
        const player = videojs('my-player', {
          autoplay: true,
          // 静音播放
          muted: 'muted',
        }, function () {
          // 视频播放完成之后执行
          this.on('ended', function () {
            videojs.log('播放结束了!')
          })
        })
        player.src({
          type: "video/mp4",
          src:data.url
        })
  
        // 2. 渲染视频详情
        const html = template('tplVideo', {
          video: data
        })
        $('#videoDetails').html(html)
  
        // 3. 设置喜欢或者不喜欢
        setLikeOrDislike(data)
  
        // 4. 渲染评论
        loadComments(data)
  
        // 等评论加载完毕，给评论的文本框注册事件
        handleComment(data)

        // 5. 订阅和取消订阅
        handleSubscribe(data.User.id)
      }
    })
}

loadData()

function handleSubscribe(userId) {
  $('.subscribe').click(function () {
    http
      .get(`/users/${userId}/togglesubscribe`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(res => {
        const { success } = res.data
        if (success) {
          $(this).toggleClass('active')

          // 订阅的人数
          const count = parseInt($('.channel-info-meta span').text())
          if ($(this).hasClass('active')) {
            // 此时取消了订阅
            $(this).text('Subscribe')
            $('.channel-info-meta span').text(count - 1 + ' subscribers')
          } else {
            $(this).text('Subscribed')
            $('.channel-info-meta span').text(count + 1 + ' subscribers')
          }

        } else {
          Toastify({
            text: '操作失败',
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()
        }
      })
  })
}


function loadComments(data) {
  const htmlComment = template('tplComment', {
    video: data
  })
  $('.comment-container').html(htmlComment)
}

function handleComment() {
  $('.add-comment textarea').keydown(function (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      http
        .post(`/videos/${queryObj.id}/comment`, {
          text: this.value
        }, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(res => {
          const { success } = res.data
          if (success) {
            Toastify({
              text: '发表评论成功',
              duration: 3000,
              backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast()
            // 重新加载评论列表
            loadData()
          } else {
            Toastify({
              text: '发表评论失败',
              duration: 3000,
              backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast()
          }
        })
    }
  })
}


function setLikeOrDislike(video) {
  if (video.isLiked) {
    $('.like svg').css('fill', 'rgb(62, 166, 255)')
    $('.dislike svg').css('fill', 'rgb(56, 56, 56)')
  } else if (video.isDisliked) {
    $('.dislike svg').css('fill', 'rgb(62, 166, 255)')
    $('.like svg').css('fill', 'rgb(56, 56, 56)')
  }
}

// 加载右侧的列表数据
function loadRelatedVideos (videoId) {
  // videoId 把当前的视频过滤掉
  http
    .get('/videos')
    .then(res => {
      let { success, data } = res.data
      if (success) {
        data = data.filter(item => item.id != videoId)

        const html = template('tplRelatedVideos', {
          videos: data.splice(0, 4)
        })
        $('.related-videos').html(html)
      }
    })
}

loadRelatedVideos(queryObj.id)