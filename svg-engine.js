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

	this.logo = "data:image/png;base64,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";
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
		if (i===(l-1)) image.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.logo);
		else image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "data:image/jpeg;base64," + data_base64_array[i]);
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


