# 签到墙(nodejs版 v1.0)

很多年前做了一个没有数据库存用户信息的php版签到墙，后来一直有支持一些中小型的线下活动，索性改了个nodejs版。

#### 功能点：

- 唯一ID`eid`参数应用不同场次和情景，可支持多人同时签入;
- 基于Leancloud存储和容器部署，静态资源存在七牛，可以自定义设置背景图和头像;
- 已经应用过数十场线下活动，大概几百人几十人配合近场iBeacon摇一摇，上墙抽奖;
- 基于web animate的弹幕，可以实时出现在大屏幕；
- 活动后可以抽奖，抽奖数可以自定义；
- 其他想到再说，譬如指定用户中奖┑(￣Д ￣)┍；

![签到墙二维码图片](https://check.xiaoxiaoge.com/public/board/style/images/qrcode.png)

- [所有活动](https://check.xiaoxiaoge.com/getevent)：https://check.xiaoxiaoge.com/getevent

- [新建活动](https://check.xiaoxiaoge.com/setevent)：https://check.xiaoxiaoge.com/setevent

2018/03/06