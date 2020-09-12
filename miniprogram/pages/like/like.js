// miniprogram/pages/like/like.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //我的收藏商品数据
    likeProductData: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取我的收藏商品
    this.getLikeProduct();
  },

  
  //获取我的收藏商品
  getLikeProduct: function () {

    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_like_product',
      success: res => {
        // console.log('res ==> ', res);

        if (res.result.data.length > 0) {

          //获取所用商品id
          var ids = [];

          res.result.data.forEach(v => {
            ids.push(v.id);
          })

          //根据商品id集合查询商品数据
          this.getProductById(ids);


        } else {
          //关闭加载提示
          wx.hideLoading();
        }

      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })

  },

  //根据商品id集合查询商品数据
  getProductById: function (ids) {
    wx.cloud.callFunction({
      name: 'get_product_byid',
      data: {
        ids: ids
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('res ==> ', res);

        this.setData({
          likeProductData: res.result.data
        })
      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //删除我的收藏商品
  removeLikeProduct: function (e) {

    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'remove_like_product',
      data: {
        id: e.currentTarget.dataset.id
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('res ==> ', res);

        //移除页面的商品
        this.data.likeProductData.splice(e.currentTarget.dataset.index, 1);
        this.setData({
          likeProductData: this.data.likeProductData
        })

      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })

  }

})