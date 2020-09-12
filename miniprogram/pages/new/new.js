// miniprogram/pages/new/new.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //定义地址数据
    addressData: {
      user: '',
      sex: [
        {
          isSelect: true,
          title: '男'
        },
        {
          isSelect: false,
          title: '女'
        }
      ],
      phone: '',
      address: '请输入地址',
      detail: '',
      tag: [
        {
          isSelect: true,
          title: '公司'
        },
        {
          isSelect: false,
          title: '家'
        },
        {
          isSelect: false,
          title: '学校'
        }
      ],

      //0: 非默认，1: 默认
      default: 0

    },

    //地址id
    id: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //截取地址id
    var id = options.id;
    console.log('id ==> ', id);

    if (id) {
      this.setData({
        id: id
      })

      //动态设置页面标题
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })

      //根据地址id查询地址数据
      this.getAddressById(id);
    }

    

  },

  //根据地址id获取地址数据
  getAddressById: function (id) {
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_address',
      data: {
        id: id
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('根据id获取地址数据 res ==> ', res);

        //绑定数据
        var dataKey = ['user', 'phone', 'address', 'detail', 'default'];

        dataKey.forEach(v => {

          this.data.addressData[v] = res.result.data[0][v];

        })

        //绑定性别，标签
        var key = ['sex', 'tag'];
        key.forEach(v => {
          this.data.addressData[v].forEach(item => {

            item.isSelect = item.title == res.result.data[0][v];

          })
        })

        console.log('this.data.addressData ==> ', this.data.addressData);

        this.setData({
          addressData: this.data.addressData
        })


      },

      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //根据地址id修改收货地址
  updateAddressById: function (id, address) {
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'update_address',
      data: {
        id: id,
        address: address
      },
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('修改收货地址 res ==> ', res);
        wx.navigateTo({
          url: '../address/address'
        })
      },

      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },


  //切换性别
  toggleSex: function (e) {

    this.toggleStatus(e, 'sex');

  },

  //切换标签
  toggleTag: function (e) {
    this.toggleStatus(e, 'tag')
  },

  //切换状态
  toggleStatus: function (e, key) {
    //如果当前选中，则不做任何事情
    if (e.currentTarget.dataset.select) {
      return;
    }

    //清除其他选中的，选中点击的
    for (var i = 0; i < this.data.addressData[key].length; i++) {
      if (this.data.addressData[key][i].isSelect) {
        this.data.addressData[key][i].isSelect = false;
        break;
      }
    }

    this.data.addressData[key][e.currentTarget.dataset.index].isSelect = true;

    this.setData({
      addressData: this.data.addressData
    })
  },

  //切换默认地址
  toggleDefault: function () {
    this.data.addressData.default = this.data.addressData.default == 0 ? 1 : 0;

    this.setData({
      addressData: this.data.addressData
    })
  },

  //修改联系人
  modifyUser: function (e) {
    console.log('e ==> ', e);

    this.data.addressData.user = e.detail.value;

    this.setData({
      addressData: this.data.addressData
    })
  },

  //修改手机号
  modifyPhone: function (e) {
    console.log('e ==> ', e);

    //验证手机号格式
    //\d: 表示 [0-9]
    // ^: 开头
    // $: 结尾
    var phoneReg = /^1[3456789]\d{9}$/

    //如果验证失败，返回false
    if (!phoneReg.test(e.detail.value)) {

      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 2000
      })

      this.data.addressData.phone = ''

    } else {

      this.data.addressData.phone = e.detail.value;

    }

    this.setData({
      addressData: this.data.addressData
    })

  },

  //修改地址
  modifyAddress: function (e) {
    // console.log('e ==> ', e);
    this.data.addressData.address = e.detail.value.join('');

    this.setData({
      addressData: this.data.addressData
    })
  },

  //修改门牌号
  modifyDetail: function (e) {
    this.data.addressData.detail = e.detail.value;

    this.setData({
      addressData: this.data.addressData
    })
  },

  //获取默认地址
  getDefaultAddress: function (address) {
    //加载提示
    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_address_default',
      success: res => {

        console.log('res ==> ', res);

        //如果存在默认地址，则先修改之前的默认地址为非默认地址，然后再写入新的地址数据
        if (res.result.data.length > 0) {

          console.log('存在默认地址');

          wx.cloud.callFunction({
            name: 'update_address_default',
            success: res => {
              console.log('res ==> ', res);

              //写入新的地址数据
              this.addAddress(address);

            },
            fail: err => {
              console.log('出错了 err ==> ', err);
            }
          })



        } else {
          //写入地址数据
          this.addAddress(address);
        }
      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //添加地址
  addAddress: function (address) {
    //将数据写入到数据库
    wx.cloud.callFunction({
      name: 'add_address',
      data: address,
      success: res => {
        //关闭加载提示
        wx.hideLoading();
        console.log('res ==> ', res);
        wx.navigateTo({
          url: '../address/address'
        })
      },
      fail: err => {
        //关闭加载提示
        wx.hideLoading();
        console.log('出错了 err ==> ', err);
      }
    })
  },

  //保存
  save: function () {

    //用于保存在数据库中的地址数据
    var address = {};

    //构造数据验证表单是否存在空值
    var data = {
      user: {
        value: '',
        msg: '联系人不能为空'
      },
      phone: {
        value: '',
        msg: '手机号不能为空'
      },
      address: {
        value: '请输入地址',
        msg: '请填写地址'
      },
      detail: {
        value: '',
        msg: '门牌号不能为空'
      }
    };

    for (var key in data) {
      if (this.data.addressData[key] == data[key].value) {
        wx.showToast({
          title: data[key].msg,
          icon: 'none',
          duration: 2000
        })
        return;
      }
      address[key] = this.data.addressData[key];
    }

    //获取性别、标签、默认地址
    var k = ['sex', 'tag'];
    k.forEach(v => {

      for (var i = 0; i < this.data.addressData[v].length; i++) {
        if (this.data.addressData[v][i].isSelect) {
          address[v] = this.data.addressData[v][i].title;
          break;
        }
      }

    })

    address.default = this.data.addressData.default;


    console.log('address ==> ', address);

    //如果地址id存在，则修改地址，否则新增地址
    if (this.data.id) {
      //修改地址

      this.updateAddressById(this.data.id, address);

    } else {

      //新增地址

      // console.log('this.data.addressData ==> ', this.data.addressData);

      

      //如果添加的地址是默认地址，则需要查询数据库是否存在默认地址
      if (address.default == 1) {
        //获取默认地址
        this.getDefaultAddress(address);
      } else {
        //加载提示
        wx.showLoading({
          title: '加载中...'
        })
        this.addAddress(address);
      }


    }

  }

})