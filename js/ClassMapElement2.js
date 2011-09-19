
//地图的元素类
function MapElement(flag,dx,dy,scale,image,context,bgcolor){
	this.flag=flag;//元素的策略标记，根据此标记逻辑层可以有自身的策略
	this.owner= 0;//这个位置子属于谁
	this.sx=0;//当前元素在素材中的x坐标
	this.sy=200;//当前元素在素材中的y坐标
	this.sw=100;//当前元素在素材中的宽度
	this.sh=100;//当前元素在素材中的高度
	this.dx=dx;//当前元素绘制在图像中的x坐标
	this.dy=dy;//当前元素绘制在图像中的y坐标
	this.scale=scale;//放大的倍数
	this.dw=this.sw*this.scale;//绘制出的图像宽度
	this.dh=this.sh*this.scale;//绘制出的图像高度
	this.image=image;//绘制的素材
	this.context=context;//绘制的canvas的context
	this.bgcolor=bgcolor;//默认擦除的颜色
};

MapElement.prototype.cleanByColor=function(){
	this.context.fillStyle=this.bgcolor;
	this.context.fillRect(this.dx,this.dy,this.dw,this.dh);
};

MapElement.prototype.draw=function(){
	switch(this.flag){
		case -1:
			this.sx=0;
			this.sy=100;
		break;
		case 0:
			this.sx=100;
			this.sy=0;
		break;
		case 1:
			this.sx=200;
			this.sy=0;
		break;
		case 20:
			this.sx=0;
			this.sy=0;
		break;
	}
	//console.log('image:'+this.image+'|sx:'+this.sx+'|sy:'+this.sy+'|sw:'+this.sw+'|sh:'+this.sh+'|dx:'+this.dx+'|dy:'+this.dy+'|dw:'+this.dw+'|dh:'+this.dh);
	this.context.drawImage(this.image,this.sx,this.sy,this.sw,this.sh,this.dx,this.dy,this.dw,this.dh);																
};

MapElement.prototype.setFlag=function(flag){
	this.flag=flag;
};

MapElement.prototype.getFlag=function(){
	return this.flag;
};

MapElement.prototype.setOwner=function(owner){
	this.owner=owner;
};

MapElement.prototype.getOwner=function(){
	return this.owner;
}

MapElement.prototype.setPosition=function(dx,dy){
	this.dx;
	this.dy;
};

MapElement.prototype.getPosition=function(dx,dy){
	return {'x':this.dx,'y':this.dy}
};