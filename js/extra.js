/**
*1.加选择
*2.加用户不点击时的倒计时，时间
*3.
*/



var game = {
	go: function (userId, step) {
		ui['user' + userId].locked = true;
		engine.go(userId, step);
	},
	confirm: function (userId) {
		console.log('game.confirm', userId);
		engine.confirm(userId);
	},
	cancel: function (userId) {
		console.log('game.cancel', userId);
		engine.cancel(userId);
	},
	block: function (userId) {
		console.log('game.block', userId);
		engine.block(userId);
	}
};


var ui = {
	user1: {
		balance: $("#player1 .money"),
		notice: $("#player1 .normal-notice"),
		confirm: $("#player1 .confirm-notice"),
		blockNumber: $("#block-number-1"),
		locked: false
	},
	user2: {
		balance: $("#player2 .money"),
		notice: $("#player2 .normal-notice"),
		confirm: $("#player2 .confirm-notice"),
		blockNumber: $("#block-number-2"),
		locked: false
	}
};

function ExtraView(){
}

ExtraView.prototype.addPerson  = function(userId){
	if(!ui['user' + userId]) {
		alert('目前只支持添加两个用户！');
	}
	
	$("#action-panel-" + userId).delegate('.blocker', 'click', function(){
		game.block(userId);
		ui['user' + userId].locked = true;
	})
	
	$("#action-panel-" + userId).delegate('.saizi', 'click', function(){
		if (ui['user' + userId].locked === true) {
			return;
		}
		game.go(userId, Math.floor(Math.random() * 6) + 1);
		ui['user' + userId].locked = true;
	})
	
	ui['user' + userId].confirm.delegate('.confirm-btn' ,'click',function(){
		game.confirm(userId);
		ui['user' + userId].confirm.hide();
	})
	
	ui['user' + userId].confirm.delegate('.cancel-btn' ,'click',function(){
		game.cancel(userId);
		ui['user' + userId].confirm.hide();
	})
	
};

ExtraView.prototype.setBalance  = function(userId, balance){
	ui['user' + userId].balance.html(balance);
};

ExtraView.prototype.confirmSpend  = function(userId, mapIndex, type, price){
	ui['user' + userId].locked = true;
	var confirmStr = '';
	if(type === "buy") {
		confirmStr = "你可以买下这块地，需要花费" + price +  "大洋，确定买么？";
	}
	
	if(type === "upgrade") {
		confirmStr = "只需要" + price +  "大洋就可以升级您的土地，要升级么？";	
	}
	
	
	ui['user' + userId].confirm.find('.tip').html(confirmStr).end().show();
};



ExtraView.prototype.setBlockNumber  = function(userId, blockNumber){
	$("#action-panel-" + userId + " .blocker").each(function(index){
		if((index+blockNumber) < 3){
			$(this).addClass('block-item-hidden');
		}
	});
};

ExtraView.prototype.confirm  = function(){
};

ExtraView.prototype.lock  = function(userId){
	ui['user' + userId].locked = true;
};

ExtraView.prototype.unlock  = function(userId){
	console.log('unlock', userId);
	ui['user' + userId].locked = false;
};

ExtraView.prototype.Notice  = function(userId, notice){
	console.log('Notice', notice);
	ui['user' + userId].notice.html(notice).show().removeClass('notice-hidden');
	
	if(ui['user' + userId].noticeTimer) {
		clearTimeout(ui['user' + userId].noticeTimer);
		ui['user' + userId].noticeTimer = null;
	}
	
	ui['user' + userId].noticeTimer = setTimeout(function(){
		ui['user' + userId].notice.html(notice).addClass('notice-hidden');
		
		setTimeout(function(){
			ui['user' + userId].notice.hide();
			
		},300)
		
	}, 2000)
};

var extraView = {
	addPerson: function (user) {
		// console.log('extra.addperson', user);
	},
	setBalance: function (user, balance) {
		// console.log('extra.setbalance', user, balance);
		ui['user' + user].balance.text(balance);
	},
	setBlockNumber: function (user, blockNumber) {
		// console.log('extra.setblocknumber', user, blockNumber);
		ui['user' + user].blockNumber.text(blockNumber);
	},
	confirm: function (user, type, price) {
		// console.log('extra.confirm', user, type, price);
		var tips = '你确定花' + price + '元' + (type == 'buy' ? '购买这片土地' : '在这里加盖房屋') + '吗？';//加选择
		ui['user' + user].confirm.text(tips);
	},
	unlock: function (user) {
		// console.log('extra.unlock', user);
		ui['user' + user].locked.text(false);
	}
};


$(window).keydown(function (event) {
	// A|up: go
	// S|down: block
	// D|left: confirm
	// F|right: cancel
	
	event.preventDefault();
	
	var keyCode = event.keyCode;
	var userId = 1;
	if(keyCode == 65 || keyCode == 83 || keyCode == 68 || keyCode == 70) {
		userId = 1;
	}
	
	if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
		userId = 2;
	}
	
	if (ui['user' + userId].locked === true) {
		return;
	}
	// 65 83 68 70
	// 38 40 37 39
	switch (event.keyCode) {
		case 65:
		game.go(userId, Math.floor(Math.random() * 6) + 1);
		break;
		case 83:
		game.block(userId);
		break;
		case 68:
		game.confirm(userId);
		break;
		case 70:
		game.cancel(userId);
		break;

		case 38:
		game.go(userId, Math.floor(Math.random() * 6) + 1);
		break;
		case 40:
		game.block(userId);
		break;
		case 37:
		game.confirm(userId);
		break;
		case 39:
		game.cancel(userId);
		break;

		default:
		return;
	}
	ui['user' + userId].locked == true;
});

function userTimer (user) {
  var maxtime = 15 //一个小时，按秒计算，自己调整!  
function CountDown(){  
	if(maxtime>=0){  
		minutes = Math.floor(maxtime/60);  
		seconds = Math.floor(maxtime%60);  
		msg = "还有"+seconds+"秒";  
		document.all["timer"].innerHTML=msg;  
		--maxtime;  
	}else{  
		clearInterval(timer);  
		alert("时间到，结束!"); 
		ui['user' + user].balance.text(balance); 
	}  
}  
timer = setInterval("CountDown()",1000);
}