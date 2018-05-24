String.prototype.format = function(obj) {
	return this.replace(/\$\w+\$/gi, function(matchs) {
		var returns = obj[matchs.replace(/\$/g, "")];		
		return (returns + "") == "undefined"? "": returns;
	});
};

function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};

function textCopy(str, callback) {
	// 动态创建 input 元素
	var aux = document.createElement("input");
	// 获得需要复制的内容
	aux.setAttribute("value", str);
	// 添加到 DOM 元素中
	document.body.appendChild(aux);
	// 执行选中
	// 注意: 只有 input 和 textarea 可以执行 select() 方法.
	aux.select();
	// 获得选中的内容
	var content = window.getSelection().toString();
	// 执行复制命令
	document.execCommand("copy");
	// 将 input 元素移除
	document.body.removeChild(aux);

	alert('复制成功：'+str);

	if (typeof(callback) === 'function' && callback ){
		callback()
	}
};

function getwsurl(){
	return 'https:' === document.location.protocol ? 'wss://check.xiaoxiaoge.com/websocket' : 'ws://127.0.0.1:8081';
};