const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express();
const router = express.Router();
const cors = require('cors');
const request = require('request');
const swig  = require('swig');
const moment = require('moment');
const AV = require('leanengine');
const bodyParser = require('body-parser');
const url = require('url');
const qs = require('querystring');
const async = require('async');

const HashMap = require('hashmap');
const userConnectionMap = new HashMap();
var connectNum = 0; //连接数

const WebSocket = require('ws');
const wss = new WebSocket.Server({
	port: 8080
});

wss.on('connection', function connection(ws) {

	connectNum++;

	ws.on('message', function(message) {

		let _msg = JSON.parse(message),
			eid = _msg.eid,
			role = _msg.role;

		switch(role) {
			case 'board' :
				userConnectionMap.set(eid, ws);
			break;
			default:
				var targetConnection = userConnectionMap.get(eid);
				if (targetConnection) {

					//服务器时间返回moment计算
					_msg.data.time = moment(new Date()).format('HH:mm:ss');

					targetConnection.send(JSON.stringify(_msg));
				}
			break;
		}

	});

	ws.on('close', function(message) {
		var _msg = JSON.parse(message);
        userConnectionMap.remove(_msg.eid);
	});

});

const wx = {
	name: 'se@xiaoxiaoge.com',
	appid: 'wxf17f8086b1190319',
	appsecret: '0cb3c787f244571c26baa5fedd2d4ed9'
};

AV.init({
	appId: process.env.LEANCLOUD_APP_ID || 'CQKaQxpSklRu4D5Bt5W2cMCR-9Nh9j0Va',
	appKey: process.env.LEANCLOUD_APP_KEY || 'LBIW9LbYTi8ihl9KC394sTXS',
	masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || 'oWFJsDlN1O4PCOAIALagkW1p'
});

var qiniu = require('qiniu');
const qiniuConf = {
	buket: 'oikewll',
	buketurl: 'http://on0oi75y0.bkt.clouddn.com',
	ak: 'WPt7GwwjtdmLxqTx72DHCnK0SwRp-syOCWKExgDV',
	sk: 'XhP5tEwHd_ubC5hSxTPclQL1EMec7qJXTAMe9aIj'
}
//七牛存储API
qiniu.conf.ACCESS_KEY = qiniuConf.ak;
qiniu.conf.SECRET_KEY = qiniuConf.sk;

moment.locale('zh-cn');
app.use(cors());
app.use(AV.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This is where all the magic happens!
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views'); 

var getparam = function(req) {
	return qs.parse(url.parse(req.url).query);
};

//静态资源中间件
// app.use('/', express.static(__dirname));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res, next){
	let eid = getparam(req).eid;

	if (!eid) {
		res.render('app', {
			title: '团建神器 ：）'
		});
		return;
	}
	let query = new AV.Query('events');
		query.get(eid).then(function(result){

			res.render('app', {
				title: '团建神器:-)',
				result: result.toJSON()
			});

		}, function (error) {
			res.render('app', {
				title: '团建神器-{{err}}'
			});
		});
});

app.get('/board', function(req, res, next){
	let eid = getparam(req).eid;

	if (!eid) {
		res.render('board', {
			title: '签到大屏幕 ：）'
		});
		return;
	}

	let query = new AV.Query('events');
		query.get(eid).then(function(result){

			res.render('board', {
				title: '签到大屏幕:-)',
				result: result.toJSON()
			});

		}, function (error) {
			res.render('board', {
				title: '签到大屏幕-{{err}}'
			});
		});
});

app.get('/signin', function(req, res, next){
	res.render('signin', {
		title: '签到上墙'
	});
});

app.get('/wsscount', function(req, res, next){
	res.send('连接数：' + connectNum);
});

app.get('/setevent', function(req, res, next){
	res.render('setevent', {
		title: '设置活动'
	});
});
app.get('/getevent', function(req, res, next){
	res.render('getevent', {
		title: '所有活动'
	});
});
app.get('/getevent/edit/:id', function(req, res, next){
	let id = req.params.id;

	let query = new AV.Query('events');
		query.get(id).then(function(result){

			res.render('setevent', {
				title: '编辑活动',
				id: id,
				result: result.toJSON()
			});
			
		}, function (err) {
			res.json(err);
		});
});

/**
* 轮询方法：
* @param: eid 场次活动的id
* @return: 用户列表，用户数
*/
app.get('/getcheck', function(req, res, next){
	let eid = getparam(req).eid;

	let query = new AV.Query('events');
		query.get(eid).then(function(result){
			let userList = result.get('userlist') || [],
				userLen = result.get('count') || 0;

			if (userList.length !== 0) {
				for (var i = userList.length - 1; i >= 0; i--) {
					userList[i].time = moment(new Date(userList[i]['checkInTime'])).startOf('hour').fromNow();
				}
			}

			res.json({
				code: 200,
				data: userList,
				count: userLen
			});
		}, function (error) {
			res.json(error);
		});
});

function updatecount(eid){
	//更新po数量统计
	var updata = AV.Object.createWithoutData('events', eid);
		updata.save().then(function (result) {
		result.increment('count', 1);
		result.fetchWhenSave(true);
		return result.save();
	});
};

app.post('/:type', function(req, res){
	var type = req.params.type,
		param = req.body || {};

	switch(type){

		case'setevent':

			//写入LC的存储
			let eventObj = AV.Object.extend('events'),
				eventList = new eventObj();

			param.openLottery = param.openLottery === '1' ? true : false;
			param.lotteryType = param.lotteryType === '1' ? 'single' : 'group';
			param.setgift = Number(param.setgift);

			for(let key in param){
				eventList.set(key, param[key]);
			}

			eventList.save().then(function (data) {

				res.redirect('/getevent/?ref.id='+data.id);

			}, function (err) {
				res.json({
					code: err.code,
					msg: '发生错误'
				});
			});

		break;

		case'getevent':

			new AV.Query('events').find().then(function(data){
				// for (var i = data.length - 1; i >= 0; i--) {
				// 	data[i]._etime = moment(new Date(data[i].etime).getTime()).format('YYYY-MM-DD HH:mm:ss');
				// }
				res.json(data);
			});

		break;

		case'delevent':

			let id = param.id;

			if (!id) {
				res.json({
					code: -1,
					msg: '缺少id参数'
				});
				return;
			}

			let deleteItem = AV.Object.createWithoutData('events', id);
				deleteItem.destroy().then(function (success) {
					// 删除成功
					res.json({
						code: 200,
						msg: 'delete done!'
					});

				}, function (error) {
					// 删除失败
					res.json({
						code: -1,
						msg: 'delete fail!'
					});
				});

		break;

		case'upevent':

			if (!param.id) {
				res.json({
					code: -1,
					msg: '缺少id参数'
				});
				return;
			}

			param.openLottery = param.openLottery === '1' ? true : false;
			param.lotteryType = param.lotteryType === '1' ? 'single' : 'group';
			param.setgift = Number(param.setgift);

			let upItem = AV.Object.createWithoutData('events', param.id);

			for(key in param){
				if (key !== 'id') {
					upItem.set(key, param[key]);
				}
			}

			upItem.save().then(function(data){

				res.redirect('/getevent/?ref.id='+param.id);
				
			}, function(err){
				res.json({
					code: -1,
					msg: 'update fail'
				})
			});

		break;

		case'checkin':
		let eid = param.eid,
			openid = param.userInfo.openid;

		//给一个服务器的签到时间
		param.userInfo.checkInTime = Date.now();

		let query = new AV.Query('events');
			query.get(eid).then(function(result){
				let userList = result.get('userlist') || [];

					for (var i = userList.length - 1; i >= 0; i--) {
						if (userList[i].openid === openid) {
							//存在相同的openid，已经签到过了
							res.json({
								code: -1
							});
							return;
						}
					}

					userList.unshift(param.userInfo);

				let event = AV.Object.createWithoutData('events', eid);
					event.set('userlist', userList);
					event.save().then(function(data){

						updatecount(eid); //更新签到人数

						res.json({
							code: 200
						});
					});
			});
		break;
	}
});

// 七牛参数token
app.get('/uptoken', function(req, res){
	var myUptoken = new qiniu.rs.PutPolicy(qiniuConf.buket);
	var token = myUptoken.token();
	// moment.locale('en');
	// var currentKey = moment(new Date()).format('YYYY-MM-DD-HH:mm:ss');
	res.header("Cache-Control", "max-age=0, private, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	if (token) {
		res.json({
			uptoken: token
		});
	}
});

module.exports = app;