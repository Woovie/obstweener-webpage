var pages = {
	home: {
		title: "Home",
		url: "home.html"
	},
	about: {
		title: "About",
		url: "about.html"
	},
	canvas: {
		title: "Canvas",
		url: "canvas.html"
	}
};

function loadAPage(e) {
	var pageToLoad = '#home';
	var clicked = e.target;
	var href = clicked.getAttribute('href');
	var pageToLoad = href;
	if (pageToLoad.length > 1) {
		pageToLoad = pageToLoad.substring(1);
	} else {
		pageToLoad = 'home';
	}
	$('#body-content').load('subpages/' + pages[pageToLoad].url);
}

$(document).ready(function() {
	$('body').bootstrapMaterialDesign();
	if (document.location.hash.length > 1) {
		var pageToLoad = document.location.hash.substring(1);
		$('#body-content').load('subpages/' + pages[pageToLoad].url);
	} else {
		$('#body-content').load('subpages/' + pages['home'].url);
	}
	document.getElementById('navbar-brand').addEventListener('click', loadAPage);
//Generate the navbar links
	var ul = document.getElementById('navbar-ul');
	for (page in pages) {
		var listitem = document.createElement('li');
		listitem.className = 'nav-item';
		var link = document.createElement('a');
		link.className = 'nav-link';
		link.href = '#' + page;
		link.addEventListener('click', loadAPage);
		var textnode = document.createTextNode(pages[page].title);
		link.appendChild(textnode);
		listitem.appendChild(link);
		ul.appendChild(listitem);
	}
});
