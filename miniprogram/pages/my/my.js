// miniprogram/pages/my/my.js
//获取小程序实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //用户信息
    userInfo: {
      url: '',
      nickName: ''
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.isAuth);
    if(app.globalData.isAuth == false){
      wx.reLaunch({
        url: '../auth/auth'
      })
  }
  },

  onShow: function () {
    //如果授权认证
    if (app.globalData.isAuth) {

      //获取用户信息
      wx.getUserInfo({
        success: res => {
          console.log('res ==> ', res);
          
          this.setData({
            userInfo: {
              url: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            }
          })
        }
      })

    }
  },

  //我的收藏
  like: function () {
    wx.navigateTo({
      url: '../like/like'
    })
  },

  //个人资料
  person: function () {
    //如果没有授权的，则跳到授权认证页面
    if (!app.globalData.isAuth) {
      wx.navigateTo({
        url: '../auth/auth'
      })
      return;
    }
    
    wx.navigateTo({
      url: '../person/person'
    })
  }

  
})