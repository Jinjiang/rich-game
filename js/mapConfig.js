//地图数据 0-4是房子信息,20是标志位
var mapData=[
	[-1,-1,0,0,-1,-1],
	[-1,20,20,20,20,-1],
	[0,20,-1,-1,20,0],
	[0,20,-1,-1,20,0],
	[0,20,-1,-1,20,0],
	[-1,20,20,20,20,-1],
	[-1,-1,0,0,-1,-1]
];
//放大倍数
var SCALE=0.8;
//图片对象
var IMAGE_LIST=[ 
	{
		id:"bg",
		url:"images/bg.gif"
	},
	{
		id : "map",
		url : "images/map.png"
	}
];
//存放已载入的图片
var imageCache=null;
//地图坐标偏移量
var offsetX;
var offsetY;
