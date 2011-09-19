//基本方法
//图片加载函数,  callback为当所有图片加载完毕后的回调函数.
function loadImage(imagesList,callback){
	var images={};
	var num=imagesList.length;
	var i=0;
	setImage();
	function setImage(){
		if(i<num){
			var img=imagesList[i];
			images[img.id]=new Image();		
			images[img.id].src=img.url;
			images[img.id].onload=function(event){
				i++;
				setImage();
			}
		}
		else
		{
			if (typeof callback=="function"){
				callback.apply(this,arguments);
			}
		}
	}
	return images;
}
