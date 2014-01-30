$( document ).ready(function() {

	var Navigation =  {
		numColumns: 2,
		numRows: 3,
		posVertical: 1, // set starting pos
		posHorizontal: 1,

		init: function() {
			// activate nav items that are clickable
			this.checkConstraints();

			// makes sure we always start in the left top corner
			this.moveTo();
		},

		checkConstraints: function(){
			var $up =  $('#up'),
				 $down = $('#down'),
				 $left = $('#left'),
				 $right = $('#right');

			if ( this.posVertical <= 1 ) {
				$up.addClass('inactive');
			} else if( $up.hasClass('inactive') ){
				$up.removeClass('inactive')
			} 

			if ( this.posVertical >= this.numRows ){
				$down.addClass('inactive');
			}else if ($down.hasClass('inactive') ) {
				$down.removeClass('inactive');
			}

			if ( this.posHorizontal <= 1 ) {
				$left.addClass('inactive');
			} else if( $left.hasClass('inactive') ){
				$left.removeClass('inactive')
			} 

			if ( this.posHorizontal >= this.numColumns ) {
				$right.addClass('inactive');
			} else if( $right.hasClass('inactive' ) ){
				$right.removeClass('inactive')
			} 		
		},

		update: function() {
			console.log("v: " + Navigation.posVertical + " h: " + Navigation.posHorizontal);

			var target = $("section[data-column='" + Navigation.posHorizontal +"']").find("article[data-slide-id='" + Navigation.posVertical +"']");
			if ( target.length === 0 ) return false;

			var prevSlide = $('article.active')[0] || false;
			$(prevSlide).removeClass('active');

			Navigation.moveTo();
		},

		onClick: function( e ) {
			var that = this;
			e.preventDefault();

			Navigation.updatePos(e.target.id);
			Navigation.update();
		},

		onKeyDown: function( e ) {
			var keyCode = e.keyCode,
				 pressed;

			switch (keyCode){
				case 37:
					pressed = "left";
					break;
				case 38:
					pressed = "up";
					break;
				case 39:
					pressed = "right";
					break;
				case 40: 
					pressed = "down";
					break;
				default:
					// some other key code we do not care about
			}	 

			Navigation.updatePos(pressed);
			Navigation.update();
		},

		moveTo: function(  ){

			var target = $("section[data-column='" + this.posHorizontal +"']").find("article[data-slide-id='" + this.posVertical +"']");

			target.addClass('active');
			$('body').animate({ 
							scrollTop: target.offset().top, 
							scrollLeft: target.offset().left, 
						},'slow');
		},

		updatePos: function( direction ) {
			switch( direction ) {
				case 'down':
					if (this.posVertical < this.numRows) this.posVertical++;
					break;
				case 'up':
					if (this.posVertical !== 0 ) this.posVertical--;
					break;
				case 'left':
					if (this.posHorizontal !== 0 ) this.posHorizontal--;
					break;
				case 'right':
					if (this.posHorizontal < this.numColumns ) this.posHorizontal++;
					break;
				default:
				console.log('Update Movement: doing nothing');
				break;
			}
			Navigation.checkConstraints();
		}
	}

	var Content = {
		update: function() {

		}
	}

	var nav = document.querySelector('nav');
	nav.addEventListener('click', Navigation.onClick);

	document.addEventListener("keydown", Navigation.onKeyDown, false);


	Navigation.init();


 // $(window).resize(function() {
 //      updateView();
 //  });

setWindowSizes()

	
	 function setWindowSizes(){
	 	   var window_width = $(window).width();
	      var window_height = $(window).height();
	      $('section').css('width', window_width + "px");
	      $('section').css('height', window_height + "px");
	 }

}); // on end ready



/*
jQuery(window).on('load', function() {


	 var $container = $('#container-1');


	var URL = "http://api.flickr.com/services/feeds/photos_public.gne";
	var ID = "25053835@N03";
	var jsonFormat = "?format=json&jsoncallback=?";
	var ajaxURL = URL + jsonFormat;

	$.getJSON(ajaxURL,function(data) {
	    $('h1').text(data.title);

	    $.each(data.items,function( i, photo) {
	    	console.log(photo);
	        var photoHTML = '<div class="item">';
	        photoHTML += '<img src="' + photo.media.m + '" width="240">';
	        $('#container').append(photoHTML);
	    }); // end each

	   
	$container.masonry({
	  columnWidth: 240,
      gutterWidth: 15,
	  itemSelector: '.item'
	});

	}); // end get JSON

  });
  */