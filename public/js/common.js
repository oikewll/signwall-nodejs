String.prototype.format = function(obj) {
	return this.replace(/\$\w+\$/gi, function(matchs) {
		var returns = obj[matchs.replace(/\$/g, "")];		
		return (returns + "") == "undefined"? "": returns;
	});
};

(function($){$.type=function(o){var _toS=Object.prototype.toString;var _types={"undefined":"undefined",number:"number","boolean":"boolean",string:"string","[object Function]":"function","[object RegExp]":"regexp","[object Array]":"array","[object Date]":"date","[object Error]":"error"};return _types[typeof o]||_types[_toS.call(o)]||(o?"object":"null")};var $specialChars={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};var $replaceChars=function(chr){return $specialChars[chr]||"\\u00"+Math.floor(chr.charCodeAt()/16).toString(16)+(chr.charCodeAt()%16).toString(16)};$.toJSON=function(o){var s=[];switch($.type(o)){case"undefined":return"undefined";break;case"null":return"null";break;case"number":case"boolean":case"date":case"function":return o.toString();break;case"string":return'"'+o.replace(/[\x00-\x1f\\"]/g,$replaceChars)+'"';break;case"array":for(var i=0,l=o.length;i<l;i++){s.push($.toJSON(o[i]))}return"["+s.join(",")+"]";break;case"error":case"object":for(var p in o){s.push('"'+p+'":'+$.toJSON(o[p]))}return"{"+s.join(",")+"}";break;default:return"";break}};$.evalJSON=function(s){if($.type(s)!="string"||!s.length){return null}return eval("("+s+")")}})(Zepto);

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
	return 'https:' === document.location.protocol ? 'wss://check.xiaoxiaoge.com' : 'ws://127.0.0.1:8081';
};