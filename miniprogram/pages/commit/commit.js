// miniprogram/pages/commit/commit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //是否显示地址列表
    isShow: false,

    //地址数据
    addressData: [],

    //地址下标
    addressIndex: -1,

    address: '选择收货地址',

    //购物车数据
    shopcartData: [],

    //商品总数量
    count: 0,

    //总金额
    total: 0,

    //购物车id
    ids: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //截取参数
    var ids = options.id.split('@');
    // console.log('ids ==> ', ids);

    this.setData({
      ids: ids
    })

    this.getShopcartById(ids);

    //获取收货地址
    this.getAddress();

  },

  //新增地址
  newAddress: function () {
    wx.navigateTo({
      url: '../new/new'
    })
  },

  //切换地址列表
  toggleAddressList: function () {
    this.setData({
      isShow: !this.data.isShow
    })
  },

  //获取地址数据
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
        console.log('地址数据 res ==> ', res);

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

  //选择收货地址
  selectAddress: function (e) {

    var index = e.currentTarget.dataset.index;

    var address = this.data.addressData[index];

    this.setData({
      address: address.address + address.detail,
      addressIndex: index
    })
  },

  //根据购物车id获取购物车数据
  getShopcartById: function (ids) {
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_shopcart_byid',
      data: {
        ids: ids
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        // console.log('res ==> ', res);
          this.setData({
            shopcartData: res.result.data
          })

        //获取商品id，商品id不能重复
        var proIds = [];
        res.result.data.forEach(v => {
          if (ids.indexOf(v.id) === -1) {
            proIds.push(v.id);
          }
        })

        // console.log('proIds ==> ', proIds);

        //根据商品id获取商品数据
        this.getProductById(proIds);

      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //根据商品id获取商品数据
  getProductById: function (proIds) {
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_product_byid',
      data: {
        ids: proIds
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        // console.log('商品数据 res ==> ', res);

        //将商品数据整合到购物车数据
        //遍历购物车数据
        var count = 0;
        var total = 0;
        this.data.shopcartData.forEach(v => {

          count += v.count;

          for (var i = 0; i < res.result.data.length; i++) {
            if (v.id == res.result.data[i]._id) {
              v.img = res.result.data[i].small_img;
              v.name = res.result.data[i].name;
              v.price = res.result.data[i].price;

              total += v.count * v.price;

              break;
            }
          }
        })

          this.setData({
            shopcartData: this.data.shopcartData,
            count: count,
            total: total
          })

          console.log('this.data.shopcartData ==> ', this.data.shopcartData);
        
      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //将订单数据写入到订单集合
  saveOrder: function (order, ids) {
    //order: 订单数据
    //ids: 购物车id集合，类型array
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'add_order',
      data: {
        data: order
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('写入订单数据 res ==> ', res);
        this.removeShopcartById(ids);
      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //根据购物车id删除购物车商品
  removeShopcartById: function (ids) {
    //ids: 购物车id集合，类型：array
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'remove_shopcart_byid',
      data: {
        ids: ids
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('删除购物车商品 res ==> ', res);

        wx.switchTab({
          url: '../order/order'
        })

      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('删除购物车商品 出错了 err ==> ', err);
      }
    })
  },

  //提交订单
  commit: function () {

    //如果没有选择地址，则不能提交订单
    if (this.data.addressIndex === -1) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //1-获取收货地址
    var address = this.data.addressData[this.data.addressIndex];
    

    var userAddress = {
      address: address.address + address.detail,
      phone: address.phone,
      user: address.user
    };

    console.log('userAddress ==> ', userAddress);

    //根据购物车id获取商品数据
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_shopcart_byid',
      data: {
        ids: this.data.ids
      },
      success: res => {
        
        console.log('res ... ==> ', res);

        //购物车数据
        var orderShopcartData = res.result.data;

        //获取商品id, 需要排除重复的商品id
        var productIds = [];
        orderShopcartData.forEach(v => {
          if (productIds.indexOf(v.id) === -1) {
            productIds.push(v.id)
          }
        })

        console.log('productIds ==> ', productIds);

        //根据商品id获取商品数据
        wx.cloud.callFunction({
          name: 'get_product_byid',
          data: {
            ids: productIds
          },
          success: res => {
            //关闭加载提示
            wx.hideLoading();
            console.log('商品数据 res ==> ', res);

            //生成订单编号, 利用时间戳实现编号
            //一个订单编号对应多个商品
            var date = new Date();
            var orderNo = 'NO' + date.getTime();
            console.log('orderNo ==> ', orderNo);

            //订单时间, 不足十，补零
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = month >= 10 ? month : '0' + month;
            var d = date.getDate();
            d = d >= 10 ? d : '0' + d;
            var hour = date.getHours();
            hour = hour >= 10 ? hour : '0' + hour;
            var minute = date.getMinutes();
            minute = minute >= 10 ? minute : '0' + minute;
            var second = date.getSeconds();
            second = second >= 10 ? second : '0' + second;

            var orderDate = year + '-' + month + '-' + d + ' ' + hour + ':' + minute + ':' + second;

            //保存订单数据
            var orderData = {

              //订单编号
              id: orderNo,

              //地址数据
              userAddress: userAddress,

              //订单时间
              orderDate: orderDate,

              //商品
              products: []
            };

            orderShopcartData.forEach(v => {
              //订单数据
              var order = {
                count: v.count,
                rule: v.rule,
                productId: v.id
              };
              for (var i = 0; i < res.result.data.length; i++) {
                if (v.id == res.result.data[i]._id) {
                  order.img = res.result.data[i].small_img;
                  order.name = res.result.data[i].name;
                  order.price = res.result.data[i].price;

                  orderData.products.push(order);
                  break;
                }
              }
            })

            // console.log('orderData ==> ', orderData);

            //将订单数据写入到订单集合
            this.saveOrder(orderData, this.data.ids);


          },
          fail: err => {
            //关闭加载提示
            wx.hideLoading();
            console.log('出错了 err ==> ', err);
          }
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