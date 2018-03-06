var user = new Array();//保存抽奖用户
var isLottery = false;
var mytime;
var token,postUrl;

function changeUser(){
	 var num=Math.floor((Math.random()*100000))%user.length;
	 $(".lotteryImg").attr('src',user[num][1]);
	 $(".lotteryName").text(user[num][0]);
	 $(".lotteryName").attr('data-id',num);
	 mytime = setTimeout(changeUser,100);
}

function getUser(posturl,tokenV){
	if(tokenV != ''){
		token = tokenV;
	}
	if(posturl != ''){
		postUrl = posturl;
	}

	$.ajax({ 
        type: "post", 
        url : postUrl,
        dataType:'json', 
        data: "token="+token,
        success: function(data){
             if(data!=null){
            	 for (var i=0;i<data.length;i++){
            	 	user.push(new Array(data[i]['nickname'],data[i]['headimgurl']));
            	 }
				 if(user.length > 0){
						$('.join-num').text(user.length);
				 }
    	     }
         }
      });	
}
var autoLottery = false;//记录是否正在自动抽奖
var autoClear;
var num=1;
//随机抽奖
function randLottery(){
	if(!isLottery){
		//每次抽奖人数
		if(!autoLottery){
			num = $("#lotteryNumSel").val();
		}
		if(user.length > 0){
			$(".btn-start > span").text('停止');
			changeUser();
			if(autoLottery){
				setTimeout(randLottery,2000);
			}
			isLottery = true;
		}else{
			alert("亲，都抽过奖啦！没有可抽奖的用户啦！");
			autoLottery = false;
			return false;
		}
	}else{
		num --;
		clearTimeout(mytime);
		isLottery = false;
		if(num > 0){
			$(".btn-start > span").text('开始抽奖('+num+')');
		}else{
			$(".btn-start > span").text('开始抽奖');
		}
		var delId = parseInt($(".lotteryName").attr('data-id'));
		var userCurrentNum =parseInt($(".winUserList > li").length)+1;
		//将中奖用户放进中奖名单
		var str = '<li class="clearfix" data-id="">'+
			'<p class="head-part">'+
				'<span class="num-p winUserRankNum left"><em>'+userCurrentNum+'</em></span>'+
				'<a href="javascript:;" class="nick-name winUserName">'+user[delId][0]+'</a>'+
				'<a href="javascript:;"><img width="60" height="60" src="'+user[delId][1]+'" alt=""></a>' +
			'</p>'+
			'<a href="javascript:void(0);" class="del delWinUser" data-id="" style="display: none;">×</a><div class="b1"></div>'+
		'</li>';
		$(".winUserList").prepend(str);
		$('.winUserNum').text(userCurrentNum);
		user.splice(delId,1);//Remove current user
		//重新获取抽奖人数
		var n = user.length;
		$('.join-num').text(n);
		if(num > 0){
			autoLottery = true;
			autoClear = setTimeout(randLottery,2000);
		}else{
			autoLottery = false;
			clearTimeout(autoClear);
		}
    }	
}
$(function(){
	$('.wsh-beak-hov').hover(function(){$('#imgfullfont').show();},function(){$('#imgfullfont').hide();});
	$(".btn-start").click(function(){
		//判断是否正在自动抽奖
		if(!autoLottery){
			randLottery();
		}else{
			alert('正在抽奖……');
		}
	});
	
	function testKeyDown(event) {
		
		  if (event.keyCode == 123)    //屏蔽 F12  
		  {   
		  	event.keyCode = 0;event.returnValue = false;
		  }
		  if (event.keyCode == 32)    //空格键抽奖  
		  {   
				//判断是否正在自动抽奖
				if(!autoLottery){
					randLottery();
				}else{
					alert('正在抽奖……');
				}
		  }				  
		 }
	document.onkeydown = function(){testKeyDown(event)} 	
	//重新抽奖
	$('.resetLotteryBtn').click(function(){
		  var isReset = confirm('点击确定将清空已中奖用户并重新放入抽奖池');
		  if(isReset){
			  $(".winUserList").html('');
			  $('.winUserNum').text('0');
			  user.splice(0,user.length);//Empty array
			  getUser('','');
		  }
	});
});	