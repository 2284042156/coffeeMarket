// miniprogram/pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //收货地址数据
    addressData: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取收货地址
    this.getAddress();

  },

  //获取收货地址
  getAddress: function () {
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_address',
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('res ==> ', res);

        this.setData({
          addressData: res.result.data
        })
      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //删除收货地址
  removeAddress: function (e) {
    console.log('e ==> ', e);

    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'remove_address',
      data: {
        id: e.currentTarget.dataset.id
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('res ==> ', res);

        if (res.result.stats.removed == 1) {
          this.data.addressData.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            addressData: this.data.addressData
          })
          wx.showToast({
            title: '成功删除收货地址',
            icon: 'none',
            duration: 2000
          })
        }

      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //修改收货地址
  updateAddress: function (e) {
    wx.navigateTo({
      url: '../new/new?id=' + e.currentTarget.dataset.id
    })
  },

  //新增地址
  newAddress: function () {
    wx.navigateTo({
      url: '../new/new'
    })
  }
  
})