function setTheme(item) {
	if (item.className == "on") {
		var style = document.getElementById("light");
		style.setAttribute('href', './style/common_styles.css');
		item.className = "off";
	}
	else {
		var style = document.getElementById("light");
		style.setAttribute('href', './style/common_styles_dark.css');
		item.className = "on";
	}
}