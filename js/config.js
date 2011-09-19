/**
	new Grid(index, type)
	new Person(userId, index)
	new Block(index)

	couldBeBLocked(index, offset)
	enoughToBuy(index, userId)
	enoughToUpgrad(index, userId)
	enoughToCost(index,userId)
	hasBlock(userId)

	MapView.set(index, type)
	PersonView.init(userId, index)
	PersonView.move(userId, index)
	BlockView.add(index)
	BlockView.remove(index)
	ExtraView.addPerson(userId)
	ExtraView.setMoney(userId, money)
	ExtraView.confirm(userId, index, type, money)
	ExtraView.setBlockCount(userId, count)
	ExtraView.setUserStatus(userId, config)
	ExtraView.gameover(userId)
 */

var CONFIG = {
	'map':[
		{'index':0, 'type':'empty', 'owner':''},
		{'index':1, 'type':'house', 'owner':''},
		{'index':2, 'type':'house', 'owner':''},
		{'index':3, 'type':'empty', 'owner':''},
		{'index':4, 'type':'house', 'owner':''},
		{'index':5, 'type':'house', 'owner':''},
		{'index':6, 'type':'house', 'owner':''},
		{'index':7, 'type':'empty', 'owner':''},
		{'index':8, 'type':'house', 'owner':''},
		{'index':9, 'type':'house', 'owner':''},
		{'index':10, 'type':'empty', 'owner':''},
		{'index':11, 'type':'house', 'owner':''},
		{'index':12, 'type':'house', 'owner':''},
		{'index':13, 'type':'house', 'owner':''}
	],
	'house':[
		{'level':0, 'price':1000, 'charge':500},
		{'level':1, 'price':1000, 'charge':1000},
		{'level':2, 'price':1100, 'charge':2000},
		{'level':3, 'price':1200, 'charge':5000}
	],
	'player':[
		{'id':1, 'balance':50000, 'blockNumber': 3, index: 0},
		{'id':2, 'balance':50000, 'blockNumber': 3, index: 7}
	],
	'timeout_seconds':15
}
