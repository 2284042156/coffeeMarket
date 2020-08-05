// miniprogram/pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图资源
      bannerData:[
        {
          imgUrl:"cloud://liang-izrfw.6c69-liang-izrfw-1302755022/banner/bga1.jpg"
        },{
          imgUrl:"cloud://liang-izrfw.6c69-liang-izrfw-1302755022/banner/bga2.jpg"
        },{
          imgUrl:"cloud://liang-izrfw.6c69-liang-izrfw-1302755022/banner/bga3.jpg"
        },{
          imgUrl:"cloud://liang-izrfw.6c69-liang-izrfw-1302755022/banner/bga4.jpg"
        },
      ],
    //轮播图配置
    swiperOptions:{
      //是否显示轮播图点
      indicatorDots:true,
      //指示点未选中颜色
      indicatorColor:"#fff",
      //指示点选中时颜色
      indicatorActiveColor:"#165dad",
      //自动切换时间间隔
      interval:3000,
      //是否自动切换
      autoplay:true,
      //是否循环滑动
      circular:true
    },
    //左侧导航栏
    asideData: [
      {
        title:'最新推荐',
        isActive:true,
        key:'is_hot',
        value:1
      },
      {
        title:'大师咖啡',
        isActive:false,
        key:'type',
        value:'coffee'
      },
      {
        title:'拿铁',
        isActive:false,
        key:'type',
        value:'latte'
      },
      {
        title:'瑞纳冰',
        isActive:false,
        key:'type',
        value:'rena_ice'
      },
    ],
    productData:[],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProduct("is_hot",1);
  },
//替换侧边栏菜单
toggleAsideMenu: function (e){
  //e为当前点击对象
  // console.log('e ==>',e);
  // 当单击对象为真时直接不做任何操作
  if(e.currentTarget.dataset.active){
    return;
  };
  // 当单击对象不为真时，遍历数组，清除isAcitive为真的对象，使其为false
  for(let i = 0;i < this.data.asideData.length;i++){
    if(this.data.asideData[i].isActive){
      this.data.asideData[i].isActive = false;
      break;
    }
  }
  //让单击对象的isAcitive为真
  let j = e.currentTarget.dataset.index;
  this.data.asideData[j].isActive = true;
  // 重新渲染
  this.setData({
    asideData:this.data.asideData
  })
  this.getProduct(e.currentTarget.dataset.key,e.currentTarget.dataset.value);
},
//获取商品数据
getProduct:function(key,value){
  //调用云函数[get_product]获取商品
 wx.cloud.callFunction({
  name:'get_product',
  //参数
  data:{
    key:key,
    value:value
  },
  success:res =>{
    console.log("res ==>",res);
    this.setData({
      productData:res.result.data
    })
  },
  fail:err =>{
    console.log('出错了 err ==>',err)
  }
})
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})