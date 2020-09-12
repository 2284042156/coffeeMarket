// miniprogram/pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
    bannerData: [
      {
        imgUrl: 'cloud://liang-izrfw.6c69-liang-izrfw-1302755022/banner/bga1.jpg'
      },
      {
        imgUrl: 'cloud://liang-izrfw.6c69-liang-izrfw-1302755022/banner/bga2.jpg'
      },
      {
        imgUrl: 'cloud://liang-izrfw.6c69-liang-izrfw-1302755022/banner/bga3.jpg'
      },
      {
        imgUrl: 'cloud://liang-izrfw.6c69-liang-izrfw-1302755022/banner/bga4.jpg'
      }
    ],

    //轮播图配置
    swiperOptions: {
      //显示面板指示点
      indicatorDots: true,

      //未选中指示点颜色
      indicatorColor: '#fff',

      //选中指示点颜色
      indicatorActiveColor: '#165dad',

      //开启自动轮播
      autoplay: true,

      //每隔一定时间切换一张图片, 单位为：ms
      interval: 3000,

      //衔接滑动
      circular: true

    },

    //侧边栏菜单数据
    asideData: [
      {
        title: '最新推荐',
        isActive: true,
        key: 'is_hot',
        value: 1
      },
      {
        title: '大师咖啡',
        isActive: false,
        key: 'type',
        value: 'coffee'
      },
      {
        title: '拿铁',
        isActive: false,
        key: 'type',
        value: 'latte'
      },
      {
        title: '瑞纳冰',
        isActive: false,
        key: 'type',
        value: 'rena_ice'
      },{
        title: 'PS视频',
        isActive: false,
        key: 'type',
        value: 'PS_video'
      }
    ],

    //商品数据
    productData: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取商品数据
    this.getProduct('is_hot', 1);
  
  },

  //切换侧边栏菜单
  toggleAsideMenu: function (e) {
    //e: 事件对象
    // console.log('e ==> ', e);

    //如果当前选中, 则不做任何事情
    if (e.currentTarget.dataset.active) {
      console.log('拦截');
      return;
    }

    for (let i = 0; i < this.data.asideData.length; i++) {
      if (this.data.asideData[i].isActive) {
        this.data.asideData[i].isActive = false;
        break;
      }
    }

    this.data.asideData[e.currentTarget.dataset.index].isActive = true;

    this.setData({
      asideData: this.data.asideData
    })

    //获取商品数据
    this.getProduct(e.currentTarget.dataset.key, e.currentTarget.dataset.value);


  },

  //获取商品数据
  getProduct: function (key, value) {

    //加载提示
    wx.showLoading({
      title: '加载中...',
    })

    //调用云函数【get_product】获取商品
    wx.cloud.callFunction({
      name: 'get_product',
      //参数
      data: {
        key: key,
        value: value
      },

      success: res => {
        // 关闭加载提示
        wx.hideLoading();
        console.log('res ==> ', res);
        this.setData({
          productData: res.result.data
        })
      },

      fail: err => {
        // 关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //查看商品详情
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  }

  

})