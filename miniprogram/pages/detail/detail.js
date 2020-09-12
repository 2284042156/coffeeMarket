// miniprogram/pages/detail/detail.js
//获取小程序实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //保存商品详情数据
    detailData: {},

    //是否收藏
    isLike: false,

    //商品规格数据
    ruleData: {},

    //商品规格类型
    ruleType: [],

    //商品数量
    count: 1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //截取参数
    var id = options.id;
    // console.log('id ==> ', id);

    this.getProductDetail(id);
  },

  
  //获取商品详情数据
  getProductDetail: function (id) {

    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    //调用云函数【get_detail】
    wx.cloud.callFunction({
      name: 'get_detail',
      data: {
        id: id
      },

      success: res => {
        //关闭加载提示
        wx.hideLoading();
        // console.log('res ==> ', res);

        var desc = res.result.data[0].desc;

        res.result.data[0].desc = desc.split(/\n/);

        this.setData({
          detailData: res.result.data[0]
        })

        console.log(this.data.detailData);

        //获取收藏商品
        this.getLikeProduct(id);

        //获取商品规格数据
        this.getRule(id);

      },

      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })

  },

  //收藏或者取消收藏商品
  likeProduct: function (e) {

    //如果没有授权的，则跳到授权认证页面
    if (!app.globalData.isAuth) {
      wx.navigateTo({
        url: '../auth/auth'
      })
      return;
    }

    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    if (!this.data.isLike) {
      //收藏商品
      wx.cloud.callFunction({
        name: 'like_product',
        data: {
          //商品id
          id: e.currentTarget.dataset.id
        },
        success: res => {
          //关闭加载提示
          wx.hideLoading();
          console.log('res ==> ', res);
          this.setData({
            isLike: true
          })
        },
        fail: err => {
          //关闭加载提示
          wx.hideLoading();
          console.log('出错了 err ==> ', err);
        }
      })
    } else {
      
      //取消收藏商品
      wx.cloud.callFunction({
        name: 'remove_like_product',
        data: {
          id: e.currentTarget.dataset.id
        },
        success: res => {
          //关闭加载提示
          wx.hideLoading();
          console.log('res ==> ', res);
          this.setData({
            isLike: false
          })
        },
        fail: err => {
          //关闭加载提示
          wx.hideLoading();
          console.log('出错了 err ==> ', err);
        }
      })
    }
  },

  //获取收藏商品
  getLikeProduct: function (id) {
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_like_product',
      data: {
        id: id
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        // console.log('res ==> ', res);

        //如果存在数据，则表明当前商品已经被收藏过
        this.setData({
          isLike: res.result.data.length > 0
        })

      },

      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //获取商品规格数据
  getRule: function (id) {
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_rule',
      data: {
        id: id
      },
      success: res => {
        console.log('商品规格数据 res ==> ', res);

        //删除id, _id
        delete res.result.data[0].id;
        delete res.result.data[0]._id;

        //删除value为空数组的对象
        for (var key in res.result.data[0]) {
          if (res.result.data[0][key].value.length == 0) {
            delete res.result.data[0][key];
          }
        }

        //获取对象的键名
        var keys = Object.keys(res.result.data[0]);

        this.setData({
          ruleData: res.result.data[0],
          ruleType: keys
        })

        console.log('this.data.ruleData ==> ', this.data.ruleData);
        console.log('this.data.ruleType ==> ', this.data.ruleType);
      },

      fail: err => {
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //切换商品规格标签
  toggleRule: function (e) {
    // console.log('e ==> ', e);

    //如果当前选中，则不做任何事情
    if (e.currentTarget.dataset.isselect) {
      // console.log('当前选中');
      return;
    }

    //清除之前选中的
    var typeData = this.data.ruleData[e.currentTarget.dataset.type];

    // console.log('typeData ==> ', typeData);

    for (var i = 0; i < typeData.value.length; i++) {
      if (typeData.value[i].isSelect) {
        typeData.value[i].isSelect = false;
        break;
      }
    }

    //选中当前项
    typeData.value[e.currentTarget.dataset.i].isSelect = true;

    this.setData({
      ruleData: this.data.ruleData
    })

  },

  //增加商品数量
  increase: function () {
    this.setData({
      count: this.data.count + 1
    })
  },

  //减少商品数量
  decrease: function () {
    if (this.data.count == 1) {
      return;
    }

    this.setData({
      count: this.data.count - 1
    })
  },

  //添加购物车
  addShopcart: function (k) {
    //商品id
    //商品规格
    //商品数量

    //如果没有授权的，则跳到授权认证页面
    if (!app.globalData.isAuth) {
      wx.navigateTo({
        url: '../auth/auth'
      })
      return;
    }

    //获取商品规格
    // console.log('this.data.ruleData ==> ', this.data.ruleData);

    var rules = [];

    for (var key in this.data.ruleData) {
      var currentRule = this.data.ruleData[key].value;
      for (var i = 0; i < currentRule.length; i++) {
        if (currentRule[i].isSelect) {
          rules.push(currentRule[i].v);
          break;
        }
      }
    }

    // console.log('rules ==> ', rules);


    var product = {
      id: this.data.detailData._id,
      count: this.data.count,
      rule: rules.join('/')
    };

    // console.log('product ==> ', product);

    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    //查询购物车是否存在当前的商品
    wx.cloud.callFunction({
      name: 'get_shopcart',
      data: {
        id: this.data.detailData._id,
        rule: rules.join('/')
      },
      success: res => {
        console.log('res ==> ', res);

        //如果购物车不存在当前商品，则添加新的数据
        if (res.result.data.length == 0) {
          this.addProduct(product, k);
        } else {
          //修改商品数量
          var id = res.result.data[0]._id;
          product.count = res.result.data[0].count + this.data.count;
          this.updateProductCount(product, k, id);
        }
      },
      fail: err => {
        console.log('出错了 err ==> ', err);
      }
    })

    

  },

  //添加新的商品到购物车
  addProduct: function (product, key) {
    wx.cloud.callFunction({
      name: 'add_shopcart',
      data: product,
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('添加购车商品 res ==> ', res);

        //立即购买，需要跳转到提交订单页面
        if (key == 1) {
          wx.navigateTo({
            url: '../commit/commit?id=' + res.result._id
          })
        }

      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err => ', err);
      }
    })
  },

  //修改购物车商品数量
  updateProductCount: function (product, key, id) {
    wx.cloud.callFunction({
      name: 'update_shopcart',
      data: product,
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('修改商品数量 res ==> ', res);
        //立即购买，需要跳转到提交订单页面
        if (key == 1) {
          wx.navigateTo({
            url: '../commit/commit?id=' + id
          })
        }
      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err => ', err);
      }
    })
  },

  //立即购买，当前加入购物车后，跳转提交订单页面
  buy: function (e) {
    //如果没有授权的，则跳到授权认证页面
    if (!app.globalData.isAuth) {
      wx.navigateTo({
        url: '../auth/auth'
      })
      return;
    }

    var key = e.currentTarget.dataset.key;

    //加入购物车
    this.addShopcart(key);
  }


})