const Config = {
	name: '签到墙2.0 by nodejs',
	description: '基于Leancloud存储和容器部署,静态资源存在七牛',
	weixin: {
		appid: '<APPID>',
		appsecret: '<APPSECRET>'
	},
	av: {
		appId: '<AVAPPID>',
		appKey: '<AVAPPKEY>',
		masterKey: '<AVMASTERKEY>'
	},
	qiniu: {
		buket: '<BUKET>',
		buketurl: '<BUKETURL',
		ak: '<BUKETAK>',
		sk: '<BUKETSK>'
	}
}

module.exports = Config;