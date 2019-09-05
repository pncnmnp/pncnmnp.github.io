function setFont(item) {
	if (item.className == "f-on") {
		 document.getElementsByClassName("blog-text")[0].style.fontFamily = "open_sansregular, sans-serif"; 
		 item.className = "f-off";
	}
	else {
		 document.getElementsByClassName("blog-text")[0].style.fontFamily = "Georgia, serif"; 
		 item.className = "f-on";
	}
}
