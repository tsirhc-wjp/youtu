
// 要登录才能看
const token = localStorage.getItem('token')
if(!token){
   // 提示
  Toastify({
    text: '请先登录',
    duration: 3000,
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    destination : 'login.html'
    }).showToast()
}

let queryObj = query(location.search)
console.log(location.search)

// 加载评论
function lodeData(){
  // 发送请求 获取数据
http
  .get(`/videos/${queryObj.id}` , {
    headers : {
      Authorization : 'Bearer' + token
    }
  })
  .then(res=>{
    const { success , data } =res.data
    if(success){
      console.log(data)

      // 1.播放视频
      const player = videojs('my-player' , {
        // 默认播放
        autoplay : true,
        // 静音播放
        muted : 'muted',
      }, function (){
        // 播放完执行
        this.on('ended' , function(){
          videojs.log('播放结束了')
        })
      })
      player.src({
        type : "video/mp4",
        src : data.url
      })

      // 2.渲染视频详情
      const html = template('tplVideo',{
        video : data
      })
      $('#videoDetails').html(html)
      // 3 点赞或拉踩  就是喜欢和不喜欢
      setLikeDislike(data)
      // 4 渲染评论区
      const htmlComment = template('tplComment',{
        video:data
      })
      $('.comment-container').html(htmlComment)
      // 5 评论加载完毕 给评论文本框注册事件
      handleComment()
      // 6 订阅和取消
      handleSubscribe(data.User.id)
    } else{
         // 提示
        Toastify({
          text: '请求错误',
          duration: 3000,
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()
          // console
    }
  })

}
lodeData()

  // 3 点赞或拉踩 
  function setLikeDislike(video){
    if(video.isLiked){
      $('.like svg').css('fill', 'rgb(62,166,255)')
      $('.dislike svg').css('fill', 'rgb(56,56,56)')
    } else if(video.isDisliked){
      $('.dislike svg').css('fill', 'rgb(62,166,255)')
      $('.like svg').css('fill', 'rgb(56,56,56)')
    }
  }

  // 加载右侧列表
  function loadRelatedVideos(videoId) {
    // videoId 把当前视频过滤掉
    http
      .get('/videos')
      .then(res=>{
        let {success , data } =res.data
        if(success){
          data = data.filter(item=>item.id !=videoId)
          const html = template('tplRelatedVideos',{
            videos : data.splice(0,4)
          })
          $('.related-videos').html(html)
        }
      })
  }
  loadRelatedVideos(queryObj.id)


  // 发布评论  相关代码
  function handleComment(){
    $('.add-comment textarea').keydown(function(e){
      // console.log(e)   //查看相关需要的代码 比如 key
      if(e.key === 'Enter'){
        // 取消默认功能
        e.preventDefault()
        http
          .post(`/videos/${queryObj.id}/comment`,{
            text : this.value
          },{
            headers :{
              Authorization : 'Bearer'+ localStorage.getItem('token')
            }
          })
          .then(res=>{
            const {success} =res.data
            if(success){
              console.log('发布成功')
              // 重新加载
              lodeData()
            } else {
                // 提示
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

  // 订阅和取消   相关代码
  function handleSubscribe(userId){
    $('.subscribe').click(function(){
      http
        .get(`/users/${userId}/togglesubscribe`,{
          headers:{
            Authorization:'Bearer' + localStorage.getItem('token')
          }
        })
        .then(res=>{
          const {success} = res.data
          if(success){
            // 成功了修改订阅的样式 变成以订阅
            $(this).toggleClass('active')
            // 订阅的人数
            const count = parseInt($('.channel-info-meta span').text())
            // 判断是否有 active 样式
            if($(this).hasClass('active')){
              // 此时取消订阅
              $(this).text('Subscribe')
              $('.channel-info-meta span').text(count - 1 + 'subscribers')
            } else {
              // 否则是订阅
              $(this).text('Subscribd')
              $('.channel-info-meta span').text(count + 1 + 'subscribers')
            }
          } else {
            // 提示
            Toastify({
              text: '订阅失败',
              duration: 3000,
              backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
              }).showToast()
          }
        })
    })
  }