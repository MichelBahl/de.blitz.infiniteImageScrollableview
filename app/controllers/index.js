
var images = ["/images/IMG_0001.jpg",
			"/images/IMG_0002.jpg",
			"/images/IMG_0003.jpg",
			"/images/IMG_0004.jpg",
			"/images/IMG_0005.jpg",
			"/images/IMG_0006.jpg",
			"/images/IMG_0007.jpg",
			"/images/IMG_0008.jpg",
			"/images/IMG_0009.jpg",
			"/images/IMG_0010.jpg"];
		
$.ifScollableview.init({
		parent			: $.pics,
	    index 			: 4,
		imageData 		: images,
});


/* Event listener
 * 
 */
function doReachLeftEnd(e){
	Ti.API.info("doReachLeftEnd");
	e.unshiftImages(["/images/addedtotheleft.jpg"]);	
}

function doReachRightEnd(e){
	Ti.API.info("doReachRightEnd");
	e.appendImages("/images/addedtotheright.jpg");
}

$.index.open();
