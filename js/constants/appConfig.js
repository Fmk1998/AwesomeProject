/**
 * desc: app的功能配置，尽可能使用改文件的配置项，方便app的整体维护
 * @flow
 */

import { Platform } from 'react-native';

// 是否启用手机自带发短信功能:true:启用手机自带发短信功能|false:调用crm内部发短信功能
const isUseLocalSendMsg = false;
// Linking组件url type常量
const LinkingType = {
  tel: 'tel',
  msg: Platform.OS === 'ios' ? 'sms' : 'smsto',
};

//
const event = {
  kpm: 'KPM',
};
const share = {
  shares: '股票期权',
  shares2: '股票期权账户',
};

// 登录模块功能配置
const login = {
  // 是否使用记住密码功能
  rememberPwd: true,
  // 登录功能实现方式 1:用户密码登录 | 2:用户密码+短信验证码 | 3: 用户密码+图片验证码 | 4 增加VPN
  loginMode: 1,
  // 短信验证码获取时间间隔（单位:秒）
  msgCountdown: 60,
  // 是否使用设备码验证
  loginCode: false,
  // 是否记录登录成功日志
  successloginLog: true,
  // 是否需要引导页
  bootPage: true,
  // 是否需要VPN登录
  isNeedVpn: false,
  // 是否整个应用都禁止截屏
  isForBiddenScreen: false,
  isNeedRegist: false,  // 设备码页面的注册按钮是否显示
  isNeedForgetPassword: false, // 登录页面的忘记密码按钮是否显示

  isHengShenCall: true, //是否调用恒生虚拟外呼
};

// 水印配置
const waterMark = {
  color: 'rgba(0, 0, 0, 0.08)',
  needWaterMark: false,
};

// 筛选配置
const filterConfig = {
  side: 'right', // 抽屉出现方向
};

// 图标是否点击后显示logo，可选值为RouteConfig.js中allTabRoutes的键名
const tabShowLogo = '';

// 微信分享的key值
const wechatKey = 'wx2ee258536a9aa65f';

// 二维码分享数据类型:1-分享图片，2-分享链接
const shareCode = { dataType: 1 };

// app权限缓存数据
const authData = [];

// 字典缓存
const dictionaryCache = {};

// 缓存用户信息
const dataCache = {
  userInfo: null, // 用户信息
  token: null, // token
  deviceId: null,
};

// 抽屉层配置
const drawerConfig = {
  type: 'overlay',
  tapToClose: true,
  acceptPan: false,
  openDrawerOffset: 0.25,
  closedDrawerOffset: 0,
  tweenHandler: ratio => ({ main: { opacity: (2 - ratio) / 2 } }),
  side: 'right',
};


// app版本路由控制
const appModules = {
  // 工作模块
  work: {
    v2: {
      // 流程显示模式，1.RN渲染版本，2.WebView渲染版本
      flow: { entry: 2 },
      event: { handleShow: true }, // 事件详情的多选操作的显示隐藏， true为显示，false为隐藏
    },
  },
  // 客户模块
  customer: {
    customerReservation: {
      // 超级app
      // hideList: ['khj', 'khfs', 'lywd','KHH','orderCustomerType'], // 隐藏模块 khj考核集， khfs开户方式， lywd来源网点，//orderCustomerType预约客户类型
      // v: '1', // 接口版本 【1超级app，需要hideList全部隐藏】

      // 万联个性化
      v: '1.1', // 接口版本 【1.1万联，hideList: 不隐藏'khj', 'khfs', 'lywd'】
      hideList: ['orderCustomerType'], //隐藏模块 orderCustomerType预约客户类型

       // 民生个性化
      // hideList: ['khj', 'khfs', 'lywd', 'customerType'], // 隐藏模块 khj考核集， khfs开户方式， lywd来源网点,customerType客户类型
      // v: '1.2', // 接口版本 【1超级app，需要hideList全部隐藏】

    },
  },
  // 驾驶舱
  cockpit: {
    businessIndicatorDetail_rank: 2,  // 经营指标二级页面排名组件，1-走角色判断，2-权限组件控制
  },
};

// 推送类型代码
const pushCode = {
  '0102': { title: '系统通知', isSelect: false },
  '0103': { title: '产品消息', isSelect: false },
  '0101': { title: '流程中心', isSelect: false },
  '0201': { title: '大额资金转账', isSelect: true },
  '0202': { title: '生日提醒', isSelect: true },
  '0104': { title: '关键事件', isSelect: true },
};

// charts默认配置
const chartsProps = {
  COLOR: ['#6EB9FF', '#FD9721', '#76ceff', '#036eb6', '#ffd02c', '#f21d1d'],
  parameter: {},
  legends: {},
  yAxis: {},
  xAxis: {},
  markers: {},
  lineProps: {},
  barProps: {},
  pieProps: {},
  style: { height: 260 },
};

const appConfig = {
  ...login,
  ...shareCode,
  tabShowLogo,
  authData,
  dictionaryCache,
  dataCache,
  wechatKey,
  appModules,
  pushCode,
  ...event,
  ...share,
  isUseLocalSendMsg,
  LinkingType,
  waterMark,
  filterConfig,
  chartsProps,
  drawerConfig,
};

export default appConfig;
