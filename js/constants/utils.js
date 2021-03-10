// @flow
import { AsyncStorage, Dimensions, NativeModules, Platform, InteractionManager, Linking } from 'react-native';
import * as CryptJS from 'crypto-js';
import lodash from 'lodash';
import Theme from 'theme';
import Toast from 'react-native-root-toast';
// import { POST, type ResponseT } from 'localRequest';
// import { CODE } from './request';
import appConfig from './appConfig';
// import pinyin from './pinyin3/src/index';

const { StatusBarManager } = NativeModules;

// 是否已上锁手势密码，默认false
export const isLocked = false;
// 判断是否是从忘记密码进入登录界面
export const isFromGesture = false;
// 手势密码加锁的计时器变量
export const gestureTimer = 0;
// 是否需要加锁手势密码，默认为需要即false
export const noNeedLock = false;
// 手势密码已加锁
export const gestureLock = true;

// 判断是否为iphoneX
function isIphoneX() {
    const height = Theme.height;
  const width = Theme.width;
  const isIphoneXs =
    (height === 812 && width === 375) || (width === 812 && height === 375); // iPhoneX/iPhoneXS
  const isIphoneXRs =
    (height === 896 && width === 414) || (width === 896 && height === 414); // iPhoneXR/iPhoneXSMax
  const isIphone12 =
    (height === 844 && width === 390) || (width === 844 && height === 390); // iPhone 12
  const isIphone12Pro =
    (height === 926 && width === 428) || (width === 926 && height === 428); // iPhone 12Pro
  const isIphone12Mini =
    (height === 812 && width === 375) || (width === 812 && height === 375); // iPhone 12Mini
  return Platform.OS === 'ios' && (isIphoneXs || isIphoneXRs || isIphone12Pro || isIphone12 || isIphone12Mini);
}

// 合并数组中对象的ID
function combineId(array: Array<Object>): string {
  let result = '';
  array.forEach((value) => {
    if (value.ID) {
      result = `${result + value.ID}|`;
    } else {
      throw new Error('对象中不包含ID');
    }
  });
  return result;
}

/**
   * 获取当前日期, 默认格式: YYYYMMDD
   *
   * @param format
   * string,根据传入的字符串{'year','month','day'}对应返回年、月、日, 默认return ; tag: number,如果是 0，则返回的月份前缀不包含0;
   * @returns {string}
   */
function getCurrentDate(format: ?string, tag: ?number): string | number {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month >= 1 && month <= 9) {
    switch (tag) {
      case 0:
        month = `${month}`;
        break;

      default:
        month = `0${month}`;
    }
  }
  if (day >= 0 && day <= 9) {
    day = `0${day}`;
  }
  let currentdate;
  switch (format) {
    case 'year':
      currentdate = year;
      break;

    case 'month':
      currentdate = month;
      break;

    case 'day':
      currentdate = day;
      break;

    default:
      currentdate = year + month + day;
  }
  return currentdate;
}

function getCurrentMonth() {
  const currentMonth = getCurrentDate('month');
  const currentYear = getCurrentDate('year');
  return `${currentYear}${currentMonth}`;
}

// /**
//  * 通用字典查询
//  *
//  */
// function queryDictionary(
//   DictionaryName: string,
//   successCallback: Function,
//   errorCallback: Function,
// ): any {
//   const url = '/crm/dictionary/v1/queryDictionary';
//   const params = {
//     dictionaryType: DictionaryName,
//   };
//   POST(url, params)
//     .then((json) => {
//       successCallback(json.O_RESULT);
//     })
//     .catch((err) => {
//       console.warn(err);
//       errorCallback(err);
//     });
// }

// const queryDictionaryPromise = async (code: string, relateId: string = '') => {
//   const dictionary = appConfig.dictionaryCache;
//   if (!dictionary[code + relateId]) {
//     const url = '/crm/dictionary/v1/queryDictionary';
//     const params = {
//       dictionaryType: code,
//       relateId: `${relateId}`, //关联ID，如果两个下拉框有关联查询，将第一个id传入到此参数中，默认无关联为空
//     };
//     const json = await POST(url, params);
//     if (json.code === CODE.SUCCESS) {
//       dictionary[code + relateId] = json;
//     }
//     return json;
//   }
//   return dictionary[code + relateId];
// };

// // 将通过GET，POST方法获取到的promise对象转换为LoadRender可用的Promise<LoadResult>
// function parsePromiseData(json: ResponseT = {}) {
//   const temp = {};
//   switch (json.code) {
//     case CODE.SUCCESS:
//       temp.status = 2;
//       break;
//     case CODE.SUCCESS_NO_DATA:
//       temp.status = 1;
//       break;
//
//     default:
//       temp.status = -1;
//       break;
//   }
//   temp.data = json.result ? [...json.result] : [];
//
//   return temp;
// }

function isArray(o: any) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

// 快速查找数组中的某个元素并返回下标
function isHasElementTwo(arr, value) {
  const str = arr.toString();
  const index = str.indexOf(value);
  if (index >= 0) {
    // 存在返回索引
    const reg1 = new RegExp(`((^|,)${value}(,|$))`, 'gi');
    return str.replace(reg1, '$2@$3').replace(/[^,@]/g, '').indexOf('@');
  }
  return -1;// 不存在此项
}

/**
 * 验证手机号码是否正确
 * @param sj
 * @returns {boolean}
 */
function checkMobileTelephone(sj) {
  const ret = false;
  const sjmar = /^1[0-9]{10}$/;
  if (sj && sj !== '' && sjmar.test(sj)) {
    return true;
  }
  return ret;
}
/**
 * 验证密码是否含有空格
 * @param sj
 * @returns {boolean}
 */
function checkPassword(sj) {
  const ret = false;
  const sjmar = /\s/;
  if (sj && sjmar.test(sj)) {
    return true;
  }
  return ret;
}

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
**
*/

function randomWord(randomFlag, min, max) {
  let str = '';
  let range = min;
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}
/*
** AES 加密
**对称加密算法，秘钥传输
** example: utils.AESEncrypt('tang*1002');
*/
function AESEncrypt(password: string = '') {
  const tempKeeey = randomWord(false, 16);
  const stringTemp = CryptJS.AES.encrypt(
    password,
    CryptJS.enc.Utf8.parse(tempKeeey),
    {
      iv: CryptJS.enc.Utf8.parse(tempKeeey),
      mode: CryptJS.mode.CBC,
      padding: CryptJS.pad.Pkcs7,
    },
  );

  const tempKey = CryptJS.enc.Utf8.parse(tempKeeey).concat(stringTemp.ciphertext);
  const tempResult = CryptJS.enc.Base64.stringify(tempKey);
  return tempResult;
}
/*
** AES 解密
**对称解密算法，秘钥传输
**example: utils.AESDecrypt( passwordSecret);
**
*/
function AESDecrypt(password: string) {
  const tempResult = CryptJS.enc.Base64.parse(password);
  const tempKey = tempResult.words.slice(0, 4);
  const keyWordArray = CryptJS.lib.WordArray.create(tempKey);
  const tempCipherText = tempResult.words.slice(4, tempResult.sigBytes - 4);
  const tempCipherTextarr = CryptJS.lib.WordArray.create(tempCipherText);
  const base64String = CryptJS.enc.Base64.stringify(tempCipherTextarr);
  const decrypted = CryptJS.AES.decrypt(base64String, keyWordArray, {
    iv: keyWordArray,
    mode: CryptJS.mode.CBC,
    padding: CryptJS.pad.Pkcs7,
  });
  const result = CryptJS.enc.Utf8.stringify(decrypted);
  return result;
}

function encode64(input) {
  const keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv'
      + 'wxyz0123456789+/' + '=';
  let output = '';
  let chr1;
  let chr2;
  let chr3 = '';
  let enc1;
  let enc2;
  let enc3;
  let enc4 = '';
  let i = 0;
  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
          + keyStr.charAt(enc3) + keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = '';
    enc1 = enc2 = enc3 = enc4 = '';
  } while (i < input.length);

  return output;
}


// asyncStorage 存值
function saveDataAsync(key: string, value: any, callback: Function) {
  let str = JSON.stringify(value);
  try {
    str = AESEncrypt(str);
  } catch (e) {
    console.error(e);
  }
  return AsyncStorage.setItem(key, str, (message) => {
    if (callback instanceof Function) {
      callback(message);
    }
  });
}

// asyncStorage 取值

async function getDataAsync(key: string, callback: Function) {
  let str = await AsyncStorage.getItem(key);
  str = str === null ? '' : str;
  try {
    str = AESDecrypt(str);
  } catch (e) {
    console.error(e);
  }
  if (callback instanceof Function) {
    callback(str);
  }
  return str;
}
// 删除一个值
function removeDataAsync(key: string) {
  return AsyncStorage.removeItem(key);
}


// 字符串转16进制
/**
 *  示例
 *  strToHexCharCode(SELECT 1>2 FROM DUAL)
 *  0x53454c45435420313e322046524f4d204455414c
 */
function strToHexCharCode(str) {
  if (str === '') { return ''; }
  const hexCharCode = [];
  hexCharCode.push('0x');
  for (let i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16));
  }
  return hexCharCode.join('');
}

// 字符串转unicode进制
/**
 *  示例
 *  strToHexCharCode(SELECT 1>2 FROM DUAL)
 *  0x53454c45435420313e322046524f4d204455414c
 */
function completion(numstr, length) {
  // var numstr = num.toString();
  const l = numstr.length;
  if (numstr.length >= length) { return numstr; }

  for (let i = 0; i < length - l; i++) {
    numstr = `0${numstr}`;
  }
  return numstr;
}

// 可以指定长度和基数生成UUID，用于微信分享地址的获取
  // eg:
  // 8 character ID (base=2)
  // uuid(8, 2)  //  "01001010"
  // 8 character ID (base=10)
  // uuid(8, 10) // "47473046"
  // 8 character ID (base=16)
  // uuid(8, 16) // "098F4D35"
function uuidGenerate(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}


function strToUniCode(str) {
  if (str === '') { return ''; }
  const hexCharCode = [];
  // hexCharCode.push("");
  for (let i = 0; i < str.length; i++) {
    let ele = (str.charCodeAt(i)).toString(16);
    if (str.charCodeAt(i).toString(16).length < 4) {
      ele = completion(ele, 4);
    }
    hexCharCode.push(ele);
  }
  return hexCharCode.join();
}

function encodeUnicode(str) {
  const res = [];
  for (let i = 0; i < str.length; i++) {
    res[i] = (`00${str.charCodeAt(i).toString(16)}`).slice(-4);
  }
  return `-u${res.join('-u')}`;
}

const ScreenWidth = Dimensions.get('window').width;

const ScreenHeight = Dimensions.get('window').height;

const uiWidth = 375;// ui设计宽度
const uiHeight = 667;

function widthPxTodp(px) {
  return (px * ScreenWidth) / uiWidth;
}

function heightPxTodp(px) {
  return (px * ScreenHeight) / uiHeight;
}

const onPageStart = lodash.debounce((name, params, page) => {
  // 避免抖动造成的多次相同路由的跳转
  InteractionManager.runAfterInteractions(() => {
    global.navigation.navigate(name, params);
  });
}, 500, {
  leading: true,
  trailing: false,
});

const onPageEnd = lodash.debounce((page) => {
  // 避免抖动造成的多次相同路由的跳转
  InteractionManager.runAfterInteractions(() => {
    if (global.navigation) global.navigation.goBack();
  });
}, 500, {
  leading: true,
  trailing: false,
});

// 转意符换成普通字符
function escape2Html(str) {
  const arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => { return arrEntities[t]; });
}

// 获取APPBAR_HEIGHT和STATUSBAR_HEIGHT
function getBarHeight() {
  const height = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
  const STATUSBAR_HEIGHT = isIphoneX() ? 44 : height;
  const APPBAR_HEIGHT = 45;
  return { APPBAR_HEIGHT, STATUSBAR_HEIGHT };
}

/**
   * 处理时间值方法，将20180522转换为2018.05.22
   * 或201809转换为2019.09
   */
function handleTimeToShow(date:number) {
  let newTime = date ? date.toString() : '';
  if (newTime.length === 8) {
    newTime = `${newTime.substring(0, 4)}.${newTime.substring(4, 6)}.${newTime.substring(6, 8)}`;
  } else if (newTime.length === 6) {
    newTime = `${newTime.substring(0, 4)}.${newTime.substring(4, 6)}`;
  }
  return newTime;
}

/**
 * 调用原生打电话、发短信、发邮件、打开网页链接等
 * @param {string} type  tel ：电话 android: smsto | ios: sms ：短信 http： 网页
 * @param {number|string} text 号码||网址
 * @param {Function} callback 成功回调函数
 * @param {string} 调用失败的提示语句
 */
function openUrl(type, text, warnText = '打开失败', callback = () => {}) {
  const url = `${type}:${text}`;
  Linking.canOpenURL(url).then((supported) => {
    if (!supported) {
      Toast.show(warnText);
    } else {
      callback();
      Linking.openURL(url);
    }
  }).catch(() => Toast.show(warnText));
}

/**
 * 检查是否需要显示返回键
 */
function showBack(props: Object):boolean {
  const { navigation } = props;
  let key = '';
  if (navigation && navigation.state && navigation.state.routeName && navigation.state.key) {
    key = navigation.state.key;
  }
  if (/^id/ig.test(key)) {
    return true;
  }
  return false;
}

/*const toPinyin = (s: string): Array<Array<string>> => {
  try {
    return pinyin(s, {
      // style: pinyin.STYLE_INITIALS,
      // heteronym: true,
    });
  } catch (error) {
    return [];
  }
};*/

const getNameFirstPinYin = (s: string):string => {
  try {
    const list = toPinyin(s);
    let out = '';
    list.forEach((item, index) => {
      const data = (item && item[0]) ? item[0].substring(0, 1) : '';
      out += data;
    });
    return out;
  } catch (e) {
    return '';
  }
};

// const toFirstPinYin = (s: string): string => {
//   try {
//     return pinyin.convertToPinyin(s);
//   } catch (error) {
//     return '';
//   }
// };

const tryParseToJson = (value: string = '') => {
  try {
    const temp = JSON.parse(value);
    return temp;
  } catch (err) {
    console.log('数据解析异常');
    return [];
  }
};

// 检查某个代码是否在权限数据中
const hasApexAuth = (authCode: string) => {
  const { authData } = appConfig;
  if (authData && authData.length) {
    const auth = authData.filter(item => item.ID === authCode)[0];

    if (auth) return true;
  }
  return false;
};

// // 打电话调用接口
// const callPhone = async (customerId: string, customerPhone: string) => {
//   const url = '/crm/sendMessage/v1/callPhone';
//   const params = {
//     customerId,
//     customerPhone,
//   };
//   const json = await POST(url, params);
//   if (json.code !== CODE.SUCCESS) {
//     Toast.show(json.note);
//   }
// };

// // 开源对接恒生的虚拟外呼
// const callPhoneToHengshen = async (param: string, param2:Object) => {
//   // 获取设备码
//   const devixesInfo = await NativeModules.GetBaseInfo.getDeviceInfo();
//   const deviceCode = devixesInfo ? devixesInfo.uniqueCode : '';
//   const params = {
//     params: param,
//   };
//   const url = '/crm/callPhone/v1/callPhone';
//   const url2 = '/crm/announcement/v1/callPhoneRecord';
//   const json = await POST(url, params);
//   if (json && json.O_CODE === 1 && json.O_RESULT && json.O_RESULT.returnCode === 0) {
//     const uniqueid = json.O_RESULT.dataSetResult[0].data[0].uniqueId;
//     const sbyy = json.O_NOTE;
//     const params2 = Object.assign({ sbm: deviceCode, uniqueid, sbyy, khh: '', sjid: '', dqym: '' }, param2);
//     const json2 = await POST(url2, params2);
//     Toast.show('呼叫成功！');
//   }
//   if (json && json.O_CODE === 1 && json.O_RESULT && json.O_RESULT.returnCode !== 0) {
//     const uniqueid = json.O_RESULT.dataSetResult[0].data[0].uniqueId;
//     const sbyy = json.O_NOTE;
//     const params2 = Object.assign({ sbm: deviceCode, uniqueid, sbyy, khh: '', sjid: '', dqym: '' }, param2);
//     const json3 = await POST(url2, params2);
//     Toast.show('呼叫失败！');
//   }
// };


// 检测密码的强度
function checkStrone(val) {
  let modes = 0;
  if (val.length < 6) return 0;
  if (/\d/.test(val)) modes += 1; // 数字
  if (/[a-z]/.test(val)) modes += 1; // 小写
  if (/[A-Z]/.test(val)) modes += 1; // 大写
  if (/\W/.test(val)) modes += 1; // 特殊字符
  // if (val.length > 12) modes += 1;// 长度大于12
  return modes;
}

  // 将数组按照num分组
const groupByIndex = (arr: Array = [], num: number = 2) => {
  const result = [];
  const temp = [];
  arr.forEach((item, index) => {
    temp.push(item);
    if (temp.length >= num || index === arr.length - 1) {
      result.push([...temp]);
      temp.splice(0, temp.length);
    }
  });
  return result;
};


export default {
  isIphoneX,
  combineId,
  getCurrentDate,
  // queryDictionary,
  getCurrentMonth,
  isArray,
  // queryDictionaryPromise,
  isHasElementTwo, // 快速查找数组中的某个元素并返回下标
  checkMobileTelephone, // 检测手机号 合法性
  checkPassword,
  saveDataAsync,
  getDataAsync,
  removeDataAsync,
  randomWord,
  AESEncrypt,
  AESDecrypt,
  encode64,
  strToHexCharCode,
  completion,
  strToUniCode,
  encodeUnicode,
  heightPxTodp,
  widthPxTodp,
  uuidGenerate,
  // onPageStart,
  // onPageEnd,
  escape2Html,
  getBarHeight,
  handleTimeToShow,
  // parsePromiseData,
  openUrl,
  showBack,
  getNameFirstPinYin,
  // toFirstPinYin,
  hasApexAuth,
  tryParseToJson,
  // callPhone,
  // callPhoneToHengshen,
  checkStrone,
  groupByIndex,
};

