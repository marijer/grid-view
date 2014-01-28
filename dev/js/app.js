$( document ).ready(function() {


	var Navigation =  {
	numColumns: 0,
	numRows: 2,
	currentVertical: 0,
	currentHorizontal: 0,

	init: function() {
		// activate nav items that are clickable
		Navigation.checkConstraints();

		// makes sure we always start in the left top corner
		$("html, body").animate({ scrollTop: 0 }, "slow");

		console.log('hi');
	},

	checkConstraints: function(){
		var $up =  $('#up'),
		$down = $('#down'),
		$left = $('#left'),
		$right = $('#right');

		if ( this.currentVertical <= 0 ) {
			$up.addClass('inactive');
		} else if( $up.hasClass('inactive') ){
			$up.removeClass('inactive')
		} 

		if ( this.currentVertical >= this.numRows ){
			$down.addClass('inactive');
		}else if ($down.hasClass('inactive') ) {
			$down.removeClass('inactive');
		}

		if ( this.currentHorizontal <= 0 ) {
			$left.addClass('inactive');
		} else if( $left.hasClass('inactive') ){
			$left.removeClass('inactive')
		} 

		if ( this.currentHorizontal >= this.numColumns ) {
			$right.addClass('inactive');
		} else if( $right.hasClass('inactive' ) ){
			$right.removeClass('inactive')
		} 		
	},

	onclick: function( e ) {
		e.preventDefault();

		var prevSlide = $('article.active')[0] || false;
		this.currentVertical = prevSlide.getAttribute('data-slide-id');
		$(prevSlide).removeClass('active');

		Navigation.updateMovement(e.target.id);
		
		Navigation.moveTo();
	},

	moveTo: function (  ){
		var target = $("article[data-slide-id='" + this.currentVertical +"']") || false;
		if ( !target ) return;
		$(target).addClass('active');
		$('body').animate({ scrollTop: target.offset().top },'slow');
	},

	updateMovement: function( el ) {
		switch( el ) {
			case 'down':
			if (this.currentVertical <= this.numRows) this.currentVertical++;
			break;
			case 'up':
			if (this.currentVertical !== 0 ) this.currentVertical--;
			break;
			default:
			console.log('doing nothing');
			break;
		}

		Navigation.checkConstraints();
	}
	}

	Navigation.init();
	var nav = document.querySelector('nav');
	nav.addEventListener('click', Navigation.onclick);


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