function BlockBase(image, container){
	
	//基本属性
	this.type = 'blocker';
	this.image = image;
	this.container = container;
	
	this.scale = SCALE;
	
	console.log(this.container);
		
	this._init();
}

/**
 ** 初始化用户头像节点，并插入DOM
 **/
BlockBase.prototype._init = function(position){

	var _width = 100 * this.scale;
	
	this.blockImage = $('<canvas width="' + _width + '" height="' + _width + '"></canvas>').appendTo(this.container);
	
	/*
	this.blockImage.css({
		width:100 * this.scale,
		height:100 * this.scale
	})
	*/
	
	/*
	this.blockImage=document.createElement("canvas");
	this.blockImage.width=this.width;
	this.blockImage.height=this.height;
	this.container.append(this.blockImage);
	*/
	
	this.context = this.blockImage[0].getContext("2d");
	
	console.log(this.image, 100 * this.scale);
	this.context.drawImage(this.image, 300, 0, 100, 100, 3, 0, _width, _width);	
}

/**
 ** 设置用户头像位置
 **/
BlockBase.prototype.setPosition = function(position){

	this.blockImage.css({
		visibility: "visible",
		opacity:0,
		left: position.x + "px",
		top : position.y + "px"
	}).animate({
		opacity:1
	}, 500);
}

/**
 ** 移除路障
 **/
BlockBase.prototype.remove = function(){
	
	console.log(this.blockImage);
	this.blockImage.fadeOut(function(){
		$(this).remove();
	});
}



function BlockView(mapView, image){
	this.blockerMap = {};
	this.image = image;
	this.mapView = mapView;
	this.container = $('<div class="block-viewer"></div>').appendTo('body');
}

/**
 ** 初始化一个用户角色，并设置坐标位置
 **/
BlockView.prototype.add = function(mapIndex) {
	
	var blocker, 
		position;

	blocker = new BlockBase(this.image, this.container);
	
	position = this.mapView.getMapByIndex(mapIndex);
	blocker.setPosition(position);
	
	this.blockerMap[mapIndex] = blocker;
};

/**
 ** 移除一个block
 **/
BlockView.prototype.remove = function(mapIndex) {
	
	var blocker, 
		position;

	blocker = this.blockerMap[mapIndex];
	
	blocker && blocker.remove();
	
	this.blockerMap[mapIndex] = null;
	
};



