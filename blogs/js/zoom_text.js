function zoomPlus(item) {
	text_size = document.getElementsByClassName("blog-text")[0];
	size = window.getComputedStyle(text_size, null).getPropertyValue('font-size');
	size = parseInt(size) + 1;
	document.getElementsByClassName("blog-text")[0].style.fontSize = String(size) + "px";
}

function zoomMinus(item) {
	text_size = document.getElementsByClassName("blog-text")[0];
	size = window.getComputedStyle(text_size, null).getPropertyValue('font-size');
	size = parseInt(size) - 1;
	document.getElementsByClassName("blog-text")[0].style.fontSize = String(size) + "px";
}