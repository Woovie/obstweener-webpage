/*
OBS Tweener Webpage
Written by Jordan Banasik

Canvas classes are based on code found here:
https://github.com/simonsarris/Canvas-tutorials
*/
var pages = {
	_blank: {
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

function loadPage() {
	var pageToLoad = '_blank';
	var uri = document.documentURI.split('/').pop();
	if (uri.length > 0) { pageToLoad = uri };
	$('#subpageContent').load('subpages/'+pages[pageToLoad].url);
}

$(document).ready(function() {
	loadPage();
});

//Canvas should have a border for mouse precision
class canvasState {
	constructor(canvas) {
		//prep
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		this.ctx = canvas.getContext('2d');
		//state
		this.valid = false;//false == canvas redraws everything
		this.shapes = [];//all of the shapes on canvas
		this.dragging = false;//track when the end user is dragging
		this.selection = null;//selected shape
		this.dragoffx = 0;//Drag offset, may not be needed tbh.
		this.dragoffy = 0;
		var myState = this;
		//events
		canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);//breaks doubleclick select
		canvas.addEventListener('mousedown', function(e) {
			var mouse = myState.getMouse(e);
			var mx = mouse.x;
			var my = mouse.y;
			var shapes = myState.shapes;
			var l = shapes.length;
			for (var i = l-1; i >= 0; i--) {//if the mouse cursor is in the shape's x/y. Since we iterate over shapes, they're in 'draw' order, meaning we'll always get the 'top' shape.
			  if (shapes[i].contains(mx, my)) {
				var mySel = shapes[i];
				myState.dragoffx = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				myState.valid = false;
				return;
			  }
			}
			if (myState.selection) {
				myState.selection = null;
				myState.valid = false;
			}
		}, true);
		canvas.addEventListener('mousemove', function(e) {
			if (myState.dragging){
				var mouse = myState.getMouse(e);
				// We don't want to drag the object by its top-left corner, we want to drag it
				// from where we clicked. Thats why we saved the offset and use it here
				myState.selection.x = mouse.x - myState.dragoffx;
				myState.selection.y = mouse.y - myState.dragoffy;   
				myState.valid = false; // Something's dragging so we must redraw
			}
		}, true);
		canvas.addEventListener('mouseup', function(e) {
			myState.dragging = false;
		}, true);
		//A box to show what's selected
		this.selectionColor = '#CC0000';
		this.selectionWidth = 2;
		this.interval = 30;
		setInterval(function() { myState.draw(); }, myState.interval);
	}
	addShape(shape) {
		this.shapes.push(shape);
		this.valid = false;
	}
	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
	draw() {
		if (!this.valid) {
			var ctx = this.ctx;
			var shapes = this.shapes;
			this.clear();
			var l = shapes.length;
			for (var i = 0; i < l; i++) {
				var shape = shapes[i];
				if (shape.x > this.width || shape.y > this.height ||
					shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
				shapes[i].draw(ctx);
			}
			if (this.selection != null) {
				ctx.strokeStyle = this.selectionColor;
				ctx.lineWidth = this.selectionWidth;
				var mySel = this.selection;
				ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
			}
			this.valid = true;
		}
	}
	getMouse(e) {
		var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
		if (element.offsetParent !== undefined) {
			do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
			} while ((element = element.offsetParent));
		}
		offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
		offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
		mx = e.pageX - offsetX;
		my = e.pageY - offsetY;
		return {x: mx, y: my};
	}
	removeShape(shape) {
		delete this.shapes[shape];
		this.valid = false;
	}
}

class shape {
	constructor(x, y, w, h, fill) {
		if (!x || !y || !w || !h || !fill) {
			console.error('A parameter was missing when passed to shape function.');
		}
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 1;
		this.h = h || 1;
		this.fill = fill || '#FF00FF';
	}
	draw(ctx) {
		ctx.fillStyle = this.fill;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
	contains(mx, my) {
		return (this.y <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);
	}
}
