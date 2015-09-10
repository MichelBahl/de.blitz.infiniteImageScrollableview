var args = arguments[0] || {},
	imageStyle = null,
	imageData = null,
    containers = [
        Ti.UI.createView(),
        Ti.UI.createView(),
        Ti.UI.createView()
    ];
    
   

function init(args) {
		
		var currentPage	= 1;
		
        // set options
        dataLength 		= args.imageData.length,
	    index 			= args.index;
		imageData 		= args.imageData || [];
		imageStyle 		= args.imageStyle || $.createStyle({ classes: ["defaultImage"] });
		__parentSymbol	= args.parent;
		
			
			if(index-1 <0){
				index = 1;
				currentPage	= 0;
			}else if(index+1 >= dataLength){
				index = index - 1;
				currentPage	= 2;
			}

			containers[0].add(createImageView(index-1));
			containers[1].add(createImageView(index));
			containers[2].add(createImageView(index+1));
			
			__parentSymbol.views = containers;
			__parentSymbol.setCurrentPage(currentPage);

        // listen to scroll
        __parentSymbol.addEventListener('scrollEnd', doScrollEndScrollableView);
        
        return;
}

function createImageView(position){
	
	var imageView	= null;
	var style 		= $.createStyle(imageStyle);

	if (imageData){

		if(imageData[position]){

	    	imageView = Ti.UI.createImageView({
		        image: imageData[position],
		    });
		}
   	}
   	
	imageView == null && (imageView = Ti.UI.createImageView());
	imageView.applyProperties(style);

	return imageView;
}

var lastDirection = 0;


function loadView(view, swipeDirection) {

	var image 				= null;
	
	lastDirection			= swipeDirection;

    if(swipeDirection == -1){

    	index--;
    	
    }else if(swipeDirection == 1){

		index++;    	
    }

    //Make sure array index can't be negative
    if(index < 0 ){
		index = 0;
    }else{	
	    // empty out any children
	    if (view.children) {
	        view.removeAllChildren();
	    }

	   	if(imageData[index + swipeDirection]){

			image = createImageView(index + swipeDirection);
		}
		
	    view.add(image);
    }
}




//GUI event handling
function doLongPressPicture(e){

	$.dialogCopySave.show();
}

function doScrollEndScrollableView(evt){
	
    switch (evt.currentPage) {
        case 0: // scrolled to the left

			if(!(index > 1)){
       	        $.trigger('reachLeftEnd', {
       	        	unshiftImages:function(images){
       	        		
	      	        	if(_.isArray(images)){
	      	        		_.each(images, function(image){
	      	        			imageData.unshift(image);
	      	        		});
	      	        	}else{
	       	        		imageData.unshift(images);
	       	        		dataLength = imageData.length;	
       	        		}
       	        	}
	        	});
	        	
	        	index++;
            }


            // so pop a view off the end, and put it at the start
            if(index > 1){
	            if (OS_ANDROID) {
	                // temporarily remove our event listener (for Android's sake...)
	                __parentSymbol.removeEventListener('scrollEnd', doScrollEndScrollableView);
	            }
	            var tempImage = __parentSymbol.views[1].children[0].image;

				__parentSymbol.views[1].children[0].image = containers[0].children[0].image;
				__parentSymbol.views[2].children[0].image = tempImage;

	            // reset the counter so we are back in the middle
	            __parentSymbol.currentPage = 1;
					            
	            if (OS_ANDROID) {
	                // now we can add the event listener again
	                __parentSymbol.addEventListener('scrollEnd', doScrollEndScrollableView);
	            }
	
	            // and now buffer load the view we reset
	            loadView(containers[0], -1);
            }
            
            break;
        case 1:
            // they didn't go anywhere; should only happen the first time around
            break;
        case 2: // scrolled to the right
	        
	          if(!(dataLength - 2 > index)){
	       	        $.trigger('reachRightEnd', {
	      	        	appendImages:function(images){
	      	        		
	      	        	if(_.isArray(images)){
	      	        		_.each(images, function(image){
	      	        			imageData.push(image);
	      	        		});
	      	        	}else{
		   	        		imageData.push(images);
	      	        	}

						dataLength = imageData.length;		      	        	
	       	       	}
		       	});
		     }

        	//Avoid overscrolling to void view
        	if(dataLength - 2 > index){
	          //  containers.push(containers.shift());
	            if (OS_ANDROID) {
	                // temporarily remove our event listener (for Android's sake...)
	                __parentSymbol.removeEventListener('scrollEnd', doScrollEndScrollableView);
	            }
				
				
				__parentSymbol.views[0].children[0].image = containers[1].children[0].image;
				__parentSymbol.views[1].children[0].image = containers[2].children[0].image;

	            // reset the counter so we are back in the middle
	            __parentSymbol.currentPage = 1;
	            
	            if (OS_ANDROID) {
	                // now we can add the event listener again
	                __parentSymbol.addEventListener('scrollEnd', doScrollEndScrollableView);
	            }
	            
	            // and now buffer load the view we reset
				loadView(containers[2], 1);
	            
	            break;
           }
    }	
}

exports.init 	= init;