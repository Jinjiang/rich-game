//地图类
function MapView(mapDataArray,width,height,scale,offsetX,offsetY,image,bgImage){
	this.mapDataArray=mapDataArray;
	this.scale=scale;
	this.offsetX=offsetX;
	this.offsetY=offsetY;
	
	this.image=image;
	this.widthNum=mapDataArray[0].length;//地图宽的元素数量
	this.heightNum=mapDataArray.length;//地图高的元素数量
	
	this.width=width;//绘制的地图宽度
	this.height=height;//绘制的地图高度

	this.sw=100;//绘制出的图像宽度
	this.sh=100;//绘制出的图像高度	
	
	if (bgImage) {
		this.drawBgByImage(bgImage);
	}

	// 创建canvas，并初始化 （也可以直接以标签形式写在页面中，然后通过id等方式取得canvas）
	this.canvas=document.createElement("canvas");
	this.canvas.width=this.width;
	this.canvas.height=this.height;
	document.body.appendChild(this.canvas);
	
	// 取得2d绘图上下文 
	this.context= this.canvas.getContext("2d");
	this.color='#000000';
	
	var mapElementArray=new Array();

	var dw=this.sw*this.scale;//绘制出的图像宽度
	var dh=this.sh*this.scale;//绘制出的图像高度	
	for(var i=0;i<this.heightNum;i++){
		var tempArray=new Array(0);
		for(var j=0;j<this.widthNum;j++){
			var flag=this.mapDataArray[i][j];
			var dx=this.offsetX+j*dw;
			var dy=this.offsetY+i*dh;
			//console.log('flag:'+flag+'owner:'+owner+'|sx:'+sx+'|sy:'+sy+'|sw:'+sw+'|sh:'+sh+'|dx:'+dx+'|dy:'+dy+'|scale:'+this.scale+'|image:'+this.image+'|context:'+this.context+'|color:'+this.color);
			tempArray[j]=new MapElement(flag,dx,dy,this.scale,this.image,this.context,this.color);
		}
		mapElementArray[i]=tempArray;
	}
	this.mapElementArray=mapElementArray;
};

MapView.prototype.getijByIndex=function(index){
	if(index>=1&&index<=2){
		var i=0;
		var j=index+1;
		return {'i':i,'j':j}
	}
	else if(index>=4&&index<=6){
		var i=index-2;
		var j=5;
		return {'i':i,'j':j}
	}
	else if(index>=8&&index<=9){
		var i=6;
		var j=11-index;
		return {'i':i,'j':j}
	}
	else if(index>=11&&index<=13){
		var j=0;
		var i=15-index;
		return {'i':i,'j':j}
	}
};

MapView.prototype.draw=function(){
	for(var i=0;i<this.heightNum;i++){
		for (var j=0; j < this.widthNum; j++) {
			var element=this.mapElementArray[i][j];
			element.draw();
		}
	}
};

MapView.prototype.drawByIndex=function(index){
	var temp=this.getijByIndex(index);
	if(temp){
		var i=temp.i;
		var j=temp.j;
		this.mapElementArray[i][j].draw();	
	}
};

MapView.prototype.drawBgByImage=function(bgImage){
	var canvas=document.createElement("canvas");
	canvas.width=this.width;
	canvas.height=this.height;
	document.body.appendChild(canvas);
	var context= canvas.getContext("2d");
	context.drawImage(bgImage,0,0,this.width,this.height);
};

MapView.prototype.cleanByColorByIndex=function(index){
	var temp=this.getijByIndex(index);
	var i=temp.i;
	var j=temp.j;
	this.mapElementArray[i][j].cleanByColor();
};

MapView.prototype.setMap=function(index,flag,owner){
	console.log(index,flag,owner);
	
	var temp=this.getijByIndex(index);
	if (temp) {
		var i=temp.i;
		var j=temp.j;
		this.mapElementArray[i][j].setFlag(flag);
	
		if(owner){
			this.mapElementArray[i][j].setOwner(owner);
		}
	};
};

MapView.prototype.getMapByIndex=function(index){	var temp=this.getijByIndex(index);	if (temp) {		var m=temp.i;		var n=temp.j;		var flag=this.mapElementArray[m][n].getFlag();		var owner=this.mapElementArray[m][n].getOwner();	};	var i;	var j;	if(index>=0&&index<=3){		i=1;		j=index+1;	}	else if(index>=4&&index<=7){		i=index-2;		j=4;	}	else if(index>=8&&index<=10){		i=5;		j=11-index;	}	else if(index>=11&&index<=13){		j=1;		i=15-index;	}	var x=this.mapElementArray[i][j].dx;	var y=this.mapElementArray[i][j].dy;	return {'flag':flag,'owner':owner,'x':x,'y':y};};