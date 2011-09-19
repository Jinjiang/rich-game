if(!window.CONFIG) {
	CONFIG = {};
}

CONFIG.gridSize = 100*SCALE;
CONFIG.roleSize = 100;

//计算头像的偏移值
var roleOffsetX = (CONFIG.roleSize - CONFIG.gridSize)/2;
var roleOffsetY = CONFIG.roleSize - CONFIG.gridSize + 20;

var roleIndex = 1;

function RoleBase(){
	
	//基本属性
	this.name = "";
	this.age = 10;
	
	//人物特殊特性
	this.talent = 10;
	this.lucky = 20;
	
	
	//人物装备
	this.props = [];
		
	this._init()
};

/**
 ** 初始化用户头像节点，并插入DOM
 **/
RoleBase.prototype._init = function(position){
	
	this.roleImage = $('<div class="role-image" style="background:url(images/role0' + roleIndex + '.png) no-repeat 0 0;"></div>');
	
	this.roleImage.appendTo('body');
	
	roleIndex++;
};

/**
 ** 设置用户位置索引，以便计算
 **/
RoleBase.prototype.setPosIndex = function(mapIndex){	
	this.posIndex = mapIndex;
};

/**
 ** 设置用户头像位置
 **/
RoleBase.prototype.setPosition = function(position){

	this.roleImage.css({
		left: (position.x - roleOffsetX) + "px",
		top : (position.y - roleOffsetY) + "px"
	});
};

function PersonView(mapView){
	
	//错位位移
	this.offsetx = 0;
	
	//用户角色实例列表
	this.roleList = {};
	
	this.mapView = mapView;
}

/**
 ** 初始化一个用户角色，并设置坐标位置
 **/
PersonView.prototype.init = function(userId, mapIndex) {
	
	var role, 
		position;
	
	if(!this.roleList[userId]) {
		console.log('create role');
		this.roleList[userId] = new RoleBase();
	}
	role = this.roleList[userId];
	position = this.mapView.getMapByIndex(mapIndex);

	if(this._checkPositionDouble(userId, mapIndex) === true) {
		position.x = position.x - this.offsetx;
	}
	role.setPosIndex(mapIndex);
	role.setPosition(position);
};

/**
 ** 检查某坐标点是否有
 **/
PersonView.prototype._checkPositionDouble = function(userId, mapIndex) {
	
	var role, 
		position;
	
	for(var roleId in this.roleList) {
		if(roleId !== userId) {
			role = this.roleList[roleId];
			console.log(parseInt(role.posIndex, 10) === parseInt(mapIndex, 10))
			if(parseInt(role.posIndex, 10) === parseInt(mapIndex, 10)) {
				return true;
			}
		}
	}
	
	return false;
};


/**
 ** 移动角色到某个位置
 **/
PersonView.prototype.move = function(userId, mapIndex){
	
	var mapPositionArr = [],
		role = this.roleList[userId],
		Map = this.mapView,
		posIndex,
		position;
	
	if(!role) {
		console.log('不存在该用户角色');
	}
	
	posIndex = role.posIndex;
	
	if( (mapIndex < posIndex) && (posIndex - mapIndex) < 4 ) {
		console.log('位置信息不正确');
	}
	
	role.setPosIndex(mapIndex);
	
	
	//计算用户头像移动路径坐标数组
	if(mapIndex > posIndex) {
		var i = posIndex+1;
		for(; i <= mapIndex; i++) {
			mapPositionArr.push(Map.getMapByIndex(i));
		}
	} else {
		for(var j = (posIndex+1); j <= 13; j++) {
			mapPositionArr.push(Map.getMapByIndex(j));
		}
		for(var k = 0; k <= mapIndex; k++) {
			mapPositionArr.push(Map.getMapByIndex(k));
		}
	}
	
	if(this._checkPositionDouble(userId, mapIndex) === true) {
		mapPositionArr[mapPositionArr.length-1].x = mapPositionArr[mapPositionArr.length-1].x - this.offsetx;
	}
	
	//让用户头像按路径位置移动
	for(var p = 0; p < mapPositionArr.length;p++) {
		
		//定时设置用户头像位置，保证动画进行
		(function(arrIndex, position){
			setTimeout(function(){
				role.setPosition(position);
			}, arrIndex*250);	
		})(p, mapPositionArr[p]);
		
	}
};



