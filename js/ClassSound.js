function Sound(domId){
	this.music=document.getElementById(domId);
	this.paused=this.music.paused;
}
Sound.prototype={
	play:function(status){
		this.music.play();
	},
	pause:function(){
		this.music.pause();
	}
}
