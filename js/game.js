/**
	@fileOverview
	游戏控制的核心代码
 */




/**
	Game控制类的构造函数
 */
function Game() {
	var gridList = [];
	var personMap = {};
	var blockMap = {};

	var mapView = new MapView();
	var personView = new PersonView();
	var blockView = new BlockView();
	var extraView = new ExtraView();

	/**
		初始化
		包括将gridList、personMap、blockMap清零
		然后生成gridList和personMap
		blockMap默认是空的
		然后通知View试图，绘制地图、人物，更新相关信息
	 */
	function init() {
		gridList = [];
		for (var i = 0; i < CONFIG.map.length; i++) {
			var item = CONFIG.map[i];
			var grid = new GridModel(item.index, item.type);
			gridList.push(grid);
		}

		personMap = {};
		for (var i = 0; i < CONFIG.player.length; i++) {
			var item = CONFIG.player[i];
			var player = new PersonModel(item.id, item.index, item.balance, item.blockNumber);
			personMap[item.id] = player;
		}

		blockMap = {};
		for (var i in personMap) {
			var person = personMap[i];
			mapView.draw();
			personView.init(person.id, person.index);
			extraView.addPerson(person.id);
			extraView.setBalance(person.id, person.balance);
			extraView.setBlockNumber(person.id, person.blockNumber);
			extraView.unlock(person.id);
		}
	}

	function getAnotherUser(user) {
		if (user == 1) return 2;
		if (user == 2) return 1;
		return -1;
	}

	/**
		判断当前用户是否可以在当前位置放置路障
		逻辑如下：
		1.该用户还有剩余的路障可用
		2.该位置没有已经放好的路障
	 */
	function couldBlock(user, index) {
		var person = personMap[user];
		return person.blockNumber > 0 && !blockMap[index];
	}

	/**
		判断当前用户是否买得起/升级得起当前位置的地/房子
	 */
	function couldBuy(user, index) {
		var person = personMap[user];
		var grid = gridList[index];
		return (grid.price > 0 && person.balance > grid.price);
	}

	/**
		判断当前用户是否付得起当前位置的地/房子的过路费
	 */
	function couldPay(user, index) {
		var person = personMap[user];
		var charge = getCharge(user, index);

		return person.balance > charge;
	}

	function getCharge(user, index) {
		var grid = gridList[index];
		var another = getAnotherUser(user);
		var gridCount = 1;

		var charge = grid.charge;
		var next = gridList[index + 1];
		var prev = gridList[index - 1];
		var next2 = gridList[index + 2];
		var prev2 = gridList[index - 2];

		if (next && next.owner == another) {
			charge += next.charge;
			gridCount++;
		}
		if (next && next.type == 'house' && next2 && next2.owner == another) {
			charge += next2.charge;
			gridCount++;
		}

		if (prev && prev.owner == another) {
			charge += prev.charge;
			gridCount++;
		}
		if (prev && prev.type == 'house' && prev2 && prev2.owner == another) {
			charge += prev2.charge;
			gridCount++;
		}

		return charge * gridCount;
	}

	/**
		判断当前用户想走到特定的位置的路途中是否有障碍物
		返回第一个路障的index，如果没有遇到路障，则返回-1
	 */
	function checkBlock(user, index) {
		var person = personMap[user];
		var start = person.index;

		if (start > index) {
			index += gridList.length;
		}

		for (var i = start + 1; i <= index; i++) {
			var offset = i % gridList.length;
			if (blockMap[offset]) {
				return offset;
			}
		}

		return -1;
	}

	function gameOver() {
		this.go = this.confirm = this.cancel = this.block = function () {};
	}


	/**
		控制当前用户向前移动
		逻辑如下：
		1.判断是否有路障
		1.1.如果有路障，则讲用户移动到路障处，同时消除该路障
		1.2.如果没有路障，则将用户移动到制定的位置
		setTimeout
		2.判断当前位置的地况
		2.1.如果为无人购买的空地，且现金充足，则询问是否购买
		2.2.如果为自己的地，且现金充足，则询问是否升级
		2.3.如果为别人的地，且现金充足，则扣钱
		2.4.如果为别人的地，且现金不足，则游戏结束，算该用户战败
	 */
	function go(user, count) {
		var person = personMap[user];
		var index = (person.index + count) % gridList.length;
		var blockIndex = checkBlock(user, index);
		var grid;
		var blocked;

		// console.log('debug', index, blockIndex);

		if (blockIndex >= 0) {
			blocked = true;
			index = blockIndex;
			if (index > person.index) {
				count = index - person.index;
			}
			else {
				count = index + gridList.length - person.index;
			}
		}

		personView.move(user, index);

		setTimeout(function () {

			grid = gridList[index];
			person.index = index;

			if (blocked) {
				blockView.remove(index);
			}

			// 判断是否是路口
			if (grid.type == 'empty') {
				// TODO: alert('NO EVENT HAPPENS');
				extraView.broadcast(user, 'EMPTY');
				extraView.unlock(user);
				return;
			}

			// 判断是谁的地
			if (grid.owner == 0) {
				// 尚无人购买的地
				if (couldBuy(user, index)) {
					extraView.confirmSpend(user, 'buy', grid.price);
				}
				else {
					extraView.broadcast(user, 'NO_MONEY');
					extraView.unlock(user);
				}
			}
			else if (grid.owner == user) {
				// 自己的地
				if (couldBuy(user, index)) {
					extraView.confirmSpend(user, 'upgrade', grid.price);
				}
				else {
					extraView.broadcast(user, 'NO_MONEY');
					extraView.unlock(user);
				}
			}
			else {
				// 别人的地
				if (couldPay(user, index)) {
					var charge = getCharge(user, index);
					person.spend(charge);
					personMap[grid.owner].earn(charge);
					extraView.setBalance(user, person.balance);
					extraView.setBalance(grid.owner, personMap[grid.owner].balance);
					extraView.unlock(user);
				}
				else {
					// 如果没钱缴过路费就破产了！
					extraView.gameOver(user);
				}
			}

		}, 250 * count);
	}

	/**
		确认当前用户的选择
		两种情况
		1.如果该位置尚无人购买，则为购买
		2.如果该位置自己已购买，则为升级
	 */
	function confirm(user) {
		var person = personMap[user],
			index = person.index,
			grid = gridList[index];
		
		person.spend(grid.price);
		
		if(grid.owner == 0) {
			grid.owner = user;
		}
		
		else if(grid.owner == user) {	
			grid.upgrade();
		}

		extraView.unlock(user);
		extraView.setBalance(user, person.balance);
		mapView.setMap(index, grid.owner, grid.level);
	}

	/**
		取消当前用户的选择
		无任何操作
	 */
	function cancel(user) {
			
		extraView.unlock(user);
	}

	/**
		让当前用户在当前位置放置路障
		判断是否可以放置路障
		如果可以则完成该操作
	 */
	function block(user) {
		
		//初始化
		var person = personMap[user],
			posIndex = person.index,
			blockIndex = posIndex,
			blockTime = 0,
			blockCount = person.blockCount;
		
			
		if(couldBlock(user, blockIndex)) {
			
			//设置路障状态
			blockTime = 500;
			
			var blockNumber = person.useBlock();

			if (blockNumber >= 0) {
				blockMap[blockIndex] = true;
				//添加路障UI
				blockView.add(blockIndex);
				//更新路障数目
				extraView.setBlockNumber(user, blockNumber);
			}

			setTimeout(function(){
				extraView.unlock(user);
			}, blockTime);
		}
		else {
			extraView.broadcast(user, 'BLOCK_ERROR');
			extraView.unlock(user);
		}
	}


	// 初始化
	this.go = go;
	this.confirm = confirm;
	this.cancel = cancel;
	this.block = block;

	// this.gridList = gridList;

	init();
}



