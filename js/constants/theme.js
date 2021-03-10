 /**
   * 付民康  2021/3/9
   * desc: app的主题样式配置，尽可能使用改文件的配置项，方便app的整体维护
   * @params
   **/
import { Dimensions, Platform, StyleSheet } from 'react-native';

// 字体颜色，用于区分文字信息的重要程度，一般来说只需要使用c1,c2,c3,c4和c0即可
// 对于特殊的字体颜色，此处不做要求，但会提供一个themeColor作为app全局色调
const color = {
  c0: '#FFFFFF', // 纯色填充的字体颜色

  c1: '#333333', // 一级文字颜色，标题，重要的说明性文字等
  c2: '#666666', // 二级文字颜色，次一级的标题色，或大段的描述性文字
  c3: '#999999', // 三级文字颜色，不太重要但又需要展示时的信息，如提示型文字、不重要的备注说明、装饰性质的日期等
  c4: '#B5B6B6', // 四级文字颜色，不重要的占位字段，如输入框占位字段，不可用状态等
  c5: '#DDDDDD', // 五级文字颜色，备用的颜色字段
  c6: '#EEEEEE', // 六级文字颜色，备用的颜色字段

  // 特殊的标识性的颜色
  cTheme: '#CC2222', // app的主题色,红色
  cThemeShallow: '#ff6864', // app主题色的较浅同色系
  cThemeDeep: '#dd0808', // app主题色的较深同色系

  cBack: '#F0F0F0', // 表示大块的背景填充色
  cGap: '#E9ECED', // 表示块与块之间的间隔背景填充色
  cLine: '#E0E0E0', // 表示分隔线条的颜色

  cUp: '#E34546', // 表示正向的颜色，如标识上涨或盈利之类的文字
  cDown: '#01BD78', // 表示负向的颜色，如标识亏损或下降等的文字
  cBlue: '#2daae4',
};

// 字体大小，用于区分文字信息的重要程度，一般来说只需要使用t1,t2,t3和特殊字号即可
const fontSize = {
  t1: 15, // 一级文字字号，标识主要的标题文字，包括列表、大段文字的标题或主要的标签性文字
  t2: 12, // 二级文字字号，一般的正文、描述性文字，或你不确定的任何字号
  t3: 11, // 三级文字字号，小标签或小图片里面的文字
  t4: 10, // 四级文字字号，备用字号
  t5: 9, // 五级文字字号，备用字号

  // 特殊的文字字号
  tHead: 18, // 导航条标题字号
  tBtn: 16, // 大按钮上的文字字号
  tTab: 14, // tab标签上的文字字号
  tLine: StyleSheet.hairlineWidth, // 最细线尺寸
};

// 设备宽高、类型等
const devices = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  fullScreenHtight: Dimensions.get('screen').height,
  platform: Platform.OS,
};


export default {
  ...color,
  ...fontSize,
  ...devices,
};
