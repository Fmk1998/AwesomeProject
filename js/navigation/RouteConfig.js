import Todo from "../modular/todo";
import Welcome from "../modular/welcome";

 /**
   * 付民康  2021/3/9
   * desc: 路由导航配置
   * @params
   **/
const RouteConfigs = {
    Todo: {
        // 设置导航的页面
        screen: Todo,
    },
    Welcome: {
        screen: Welcome,
    },
};

export default RouteConfigs;
