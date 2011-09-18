var start = false;

function resize() {
	var map = start ? $("#map") : $('#splash');
	var width = start ? 960 : 640;
	var height = 580;

	map.css('margin-top', ($(window).height() - height) / 2 + 'px');
	if ($(window).width() < width) {
		map.css('margin-left', ($(window).width() - width) / 2 + 'px');
	}
	else {
		map.css('margin-left', 'auto');
	}
}

$(window).resize(resize);
resize();

var game;

$('#btn-play').click(function () {
	start = true;
	$('#splash').hide();
	$('#header, #map, #ctrl').show();
	resize();
	game = new Game;
});
