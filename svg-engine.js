/*
* SVGENGINE: programmatically building a SVG from base64 dataUri images array
*
* D3 library Alternative:
* var svg = d3.select("svg");
* svg.append("image")
*	.attr("xlink:href", "data:image/jpeg;base64," + data_base64_array[i])
*	.attr("x", rows)
*	.attr("y", cols)
*	.attr("width", this.image_size)
*	.attr("height", this.image_size);
*	svg.appendChild(image);
*	
*/

var SvgEngine = function(image_urls, div_id, image_size, svg_size){

	that = this;
	this.svg_size = svg_size;
	this.div_id = div_id;
	this.image_size = image_size;
	this.square_num = getSquare(image_urls.length); // calculate perfect square
	this.image_urls = image_urls.slice(0,this.square_num*this.square_num);
	this.div_id = div_id;
	this.viewBox_width = this.square_num * this.image_size;
	this.viewBox_height = this.square_num * this.image_size;

	//this.logo = "data:image/png;base64, ... ";
	//check if num is square, otherwise return closest lower square
	function getSquare(num){
		function isSquare (n) {
    		return n > 0 && Math.sqrt(n) % 1 === 0;
		}
		if (isSquare(num)) return Math.sqrt(num);
		else return Math.floor(Math.sqrt(num));
	}
};

SvgEngine.prototype.init = function(callback){

	if (!this.svg_size || typeof this.svg_size !== "number") this.svg_size = this.square_num * this.image_size;
	if (typeof this.image_urls!== "object" || !this.image_urls[0]) callback(true, null);
	if (!this.div_id || typeof this.div_id !== "string") callback(true, null);
	if (!this.image_size || typeof this.image_size !== "number") callback(true, null);

	this.pushImageBase64(this.image_urls, function(error, data_base64){
		if (error) callback(true, null);
		else {
			var svg_id = that.imgBase64ToSvg(data_base64);
			callback(null, svg_id); // final call home, return SVG_ÍD
		}
	});
};

SvgEngine.prototype.pushImageBase64 = function(arr, callback){
	var data_base64_arr = [];
	function checkFetchedUrls(base64data){
		data_base64_arr.push(base64data);
		if (data_base64_arr.length === arr.length) callback(null, data_base64_arr); 
	}
	for (var i = 0, l = arr.length; i < l; i++){
	this.getImageBase64(arr[i], checkFetchedUrls);
	}
};

SvgEngine.prototype.getImageBase64 = function (url, callback) {
	// 1. Loading file from url:
	var xhr = new XMLHttpRequest(url);
	xhr.open('GET', url, true); // url is the url of a PNG image.
	xhr.responseType = 'arraybuffer';
	xhr.callback = callback;
	xhr.onload = function (e) {
		if (this.status == 200) { // 2. When loaded, do:
    		var imgBase64 = that.converterEngine(this.response); // convert BLOB to base64
    		this.callback(imgBase64); //execute callback function with data
		}
	};
	xhr.send();
};

SvgEngine.prototype.converterEngine = function (input) { // fn BLOB => Binary => Base64
	var uInt8Array = new Uint8Array(input),
	i = uInt8Array.length;
	var biStr = []; //new Array(i);
	while (i--) {
		biStr[i] = String.fromCharCode(uInt8Array[i]);
	}
	var base64 = window.btoa(biStr.join(''));
	return base64;
};

SvgEngine.prototype.imgBase64ToSvg = function(data_base64_array) {
	var image = null;
	var rows = 0;
	var cols = 0;
	var svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); //create the SVG and set attributes
	svg.setAttribute('id','mySVG'); //set SVG ID
	svg.setAttribute("width", this.svg_size);
	svg.setAttribute("height", this.svg_size);
	svg.setAttribute("style", "stroke-width: 0px; background-color: black;"); //set SVG background color
	svg.setAttribute("viewBox", "0 0 " + this.viewBox_width + " " + this.viewBox_height);
	
	//programmatically building the SVG from base64 dataUri images array
	for (var i = 0, l = data_base64_array.length; i < l; i++){

		image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
		//if (i===(l-1)) image.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.logo);
		//else image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "data:image/jpeg;base64," + data_base64_array[i]);
		image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "data:image/jpeg;base64," + data_base64_array[i]);
		image.setAttributeNS(null, "x", rows);
		image.setAttributeNS(null, "y", cols);
		image.setAttributeNS(null, "width", this.image_size);
		image.setAttributeNS(null, "height", this.image_size);
		svg.appendChild(image);
	
		rows += this.image_size;
		// if rows > SVG viewbox width => rows = 0 && cols + image_size
		if (rows >= this.viewBox_width){ 
			cols += this.image_size;
			rows = 0;
		}
	}
	$(this.div_id).html(svg); //appends svg to supplied div ID
	return svg.id;
};

SvgEngine.prototype.svgToImage = function(svg_id){
	var svg = document.getElementById(svg_id);
	var xml = new XMLSerializer().serializeToString(svg);
	var data = 'data:image/svg+xml;base64,' + btoa(xml);
	var image = new Image();
	image.setAttribute('src', data);
	return image;
};


