/**
===== View API =====

  * MapView
    * draw()
    * getMap(index)
    * setMap(index, owner, level)
  * PersonView
    * init(user, index)
    * move(user, index)
  * BlockView
    * add(index)
    * remove(index)
  * ExtraView
    * addPerson(user)
    * setBalance(user, balance)
    * setBlockNumber(user, blockNumber)
    * confirmSpend(user, type, price)
    * unlock(user)
    * gameOver(user)
 */

function log() {
}

function MapView() {
	this.draw = this.getMap = log;
	this.setMap = function (index, owner, level) {
		// console.log('set map', index, owner, level);
		// $('#house-' + index).data('owner', owner);
		$('#house-' + index).attr('data-owner', owner);
		// $('#building-' + index).data('level', level);
		$('#building-' + index).attr('data-level', level);
	};
}

function PersonView() {
	this.init = function (user, index) {
		// console.log('user init', user, index);
		// $('#user-' + user).data('offset', index);
		$('#user-' + user).attr('data-offset', index);
	};
	this.move = function (user, index) {
		// console.log('user move', user, index);
		var person = $('#user-' + user);
		// var currentIndex = person.data('offset');
		var currentIndex = person.attr('data-offset') - 0;

		function go() {
			currentIndex = (currentIndex + 1) % 14;
			// person.data('offset', currentIndex);
			person.attr('data-offset', currentIndex);
			if (currentIndex != index) {
				setTimeout(go, 250);
			}
		}

		go();
	};
}

function BlockView() {
	this.add = function (index) {
		// console.log('block add', index);
		// var block = $('<div></div>').data('offset', index);
		var block = $('<div></div>').attr('data-offset', index);
		var list = $('#block-list');
		list.append(block);
	};
	this.remove = function (index) {
		// console.log('block remove', index);
		$('#block-list > div').each(function () {
			var block = $(this);
			// if (block.data('offset') == index) {
			// 	block.remove();
			// }
			if (block.attr('data-offset') == index) {
				block.remove();
			}
		})
	};
}

function ExtraView() {
	var userStatus = {
		1: {
			locked: true,
			confirm: false,
			key: {
				main: {name: "A", code: 65},
				sub: {name: "S", code: 83}
			}
		},
		2: {
			locked: true,
			confirm: false,
			key: {
				main: {name: "[", code: 219},
				sub: {name: "]", code: 221}
			}
		}
	}

	function broadcast(user, news) {
		var li = $('<li></li>').text(news);
		$('#ctrl-user-' + user + ' .wall').append(li);
		li[0].scrollIntoView();
	}

	function keydown(event) {
		switch (event.keyCode) {
			case userStatus[1].key.main.code:
			if (userStatus[1].locked) {
				return;
			}
			if (userStatus[1].confirm) {
				userStatus[1].confirm = false;
				userStatus[1].locked = true;
				// $('#ctrl-user-1 .progress').removeAttr('waiting');
				broadcast(1, '确认成功！现在您可以继续向前走或放置路障');
				game.confirm(1);
			}
			else {
				var count = Math.floor(Math.random() * 6) + 1;
				broadcast(1, '投骰子成功！你现在可以向前走' + count + '步');
				userStatus[1].locked = true;
				// $('#ctrl-user-1 .progress').removeAttr('waiting');
				game.go(1, count);
			}
			break;
			case userStatus[1].key.sub.code:
			if (userStatus[1].locked) {
				return;
			}
			if (userStatus[1].confirm) {
				userStatus[1].confirm = false;
				userStatus[1].locked = true;
				// $('#ctrl-user-1 .progress').removeAttr('waiting');
				broadcast(1, '您已经选择了放弃，现在您可以继续向前走或放置路障');
				game.cancel(1);
			}
			else {
				userStatus[1].locked = true;
				// $('#ctrl-user-1 .progress').removeAttr('waiting');
				game.block(1);
			}
			break;
			case userStatus[2].key.main.code:
			if (userStatus[2].locked) {
				return;
			}
			if (userStatus[2].confirm) {
				userStatus[2].confirm = false;
				userStatus[2].locked = true;
				// $('#ctrl-user-2 .progress').removeAttr('waiting');
				broadcast(2, '确认成功！现在您可以继续向前走或放置路障');
				game.confirm(2);
			}
			else {
				var count = Math.floor(Math.random() * 6) + 1;
				broadcast(2, '投骰子成功！你现在可以向前走' + count + '步');
				userStatus[2].locked = true;
				// $('#ctrl-user-2 .progress').removeAttr('waiting');
				game.go(2, count);
			}
			break;
			case userStatus[2].key.sub.code:
			if (userStatus[2].locked) {
				return;
			}
			if (userStatus[2].confirm) {
				userStatus[2].confirm = false;
				userStatus[2].locked = true;
				// $('#ctrl-user-2 .progress').removeAttr('waiting');
				broadcast(2, '您已经选择了放弃，现在您可以继续向前走或放置路障');
				game.cancel(2);
			}
			else {
				userStatus[2].locked = true;
				// $('#ctrl-user-2 .progress').removeAttr('waiting');
				game.block(2);
			}
			break;
			default:
			return;
		}
	}

	this.addPerson = function (user) {
		// console.log('extra add person', user);
		broadcast(user, '您好，感谢您支持大富翁游戏！您可以按"' +
			userStatus[user].key.main.name + '"键前进，或"' +
			userStatus[user].key.sub.name + '"键放置路障。现在就可以开始了！');
	};
	this.setBalance = function (user, balance) {
		// console.log('extra set balance', user, balance);
		$('#header-' + user + ' .balance').text('$' + balance);
	};
	this.setBlockNumber = function (user, blockNumber) {
		// console.log('extra set block number', user, blockNumber);
		broadcast(user, '路障已放置，您还有' + blockNumber + '个路障可以摆放。');
		broadcast(user, '现在您可以继续向前走或放置路障');
	};
	this.confirmSpend = function (user, type, price) {
		// console.log('extra confirm spend', user, type, price);
		broadcast(user, '你确定要花费' + price + '万卢布' +
			(type == 'buy' ? '买下这块空地' : '在此加盖房屋') + '吗？按"' +
			userStatus[user].key.main.name + '"键表示确定，按"' +
			userStatus[user].key.sub.name + '"键表示放弃');
		userStatus[user].confirm = true;
		userStatus[user].locked = false;
		// setTimeout(function () {
		// 	$('#ctrl-user-' + user + ' .progress').attr('waiting', 'waiting');
		// }, 13);
		// setTimeout(function () {
		// 	userStatus[user].confirm = false;
		// 	userStatus[user].locked = true;
		// 	$('#ctrl-user-' + user + ' .progress').removeAttr('waiting');
		// 	broadcast(user, '您已经选择了放弃，现在您可以继续向前走或放置路障');
		// 	game.cancel(user);
		// }, 10000);
	};
	this.unlock = function (user) {
		// console.log('extra unlock user', user);
		userStatus[user].locked = false;
		// setTimeout(function () {
		// 	$('#ctrl-user-' + user + ' .progress').attr('waiting', 'waiting');
		// }, 13);
		// setTimeout(function () {
		// 	var count = Math.floor(Math.random() * 6) + 1;
		// 	broadcast(user, '投骰子成功！你现在可以向前走' + count + '步');
		// 	userStatus[user].locked = true;
		// 	$('#ctrl-user-1 .progress').removeAttr('waiting');
		// 	game.go(user, count);
		// }, 10000);
	};
	this.gameOver = function (user) {
		// console.log('Game Over!');
		broadcast(user, '杯具。。。你输了。。。');
		$(window).unbind('keydown', keydown);
		alert('游戏结束！' + user + '号玩家输了。。。');
	}
	this.broadcast = function (user, type) {
		switch (type) {
			case 'BLOCK_ERROR':
			broadcast(user, '您不能在此处放置路障，原因可能是此处已经有路障了，或您已经没有路障可以放置');
			break;
			case 'NO_MONEY':
			broadcast(user, '您的现金不足。。。');
			break;
			case 'EMPTY':
			broadcast(user, '今天天气不错啊！请继续');
			break;
		}
	}

	$(window).bind('keydown', keydown);
}



