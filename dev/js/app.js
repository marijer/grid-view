$( document ).ready(function() {

	var Navigation =  {
		numColumns: 6,
		numRows: 5,
		posHorizontal: 1,
		posVertical: 1, 

		init: function() {
			// activate nav items that are clickable
			this.checkConstraints();

			// makes sure we always start with the posVertical and posHorizontal specified - provides flexibility + workaround refresh
			this.moveTo();
		},

		update: function() {
			console.log("v: " + Navigation.posVertical + " h: " + Navigation.posHorizontal);

			var target = $("section[data-column='" + Navigation.posHorizontal +"']").find("article[data-slide-id='" + Navigation.posVertical +"']");
			if ( target.length === 0 ) return false;

			var prevSlide = $('article.active')[0] || false;
			$(prevSlide).removeClass('active');

			Navigation.moveTo( target );
			
		},

		moveTo: function( el ){
			var target = el || $("section[data-column='" + this.posHorizontal +"']").find("article[data-slide-id='" + this.posVertical +"']");
			Navigation.setContent( target[0] );

			target.addClass('active');
			$('body, html').animate({ 
							scrollTop: target.offset().top, 
							scrollLeft: target.offset().left, 
						},'slow');
		},

		setContent: function( el ) {
			var contentAttribute = el.getAttribute( 'data-content' ) || false;
			if ( contentAttribute ) {
				Content.setContent( contentAttribute, el );
			}
		},

		onClick: function( e ) {
			var that = this;
			e.preventDefault();

			Navigation.updatePos(e.target.id);
		},

		onKeyDown: function( e ) {
			var keyCode = e.keyCode,
				 pressed;

			switch (keyCode){
				case 37:
					pressed = "left"; break;
				case 38:
					pressed = "up"; break;
				case 39:
					pressed = "right"; break;
				case 40: 
					pressed = "down"; break;
				default:
					// some other key code we do not care about
			}	 

			Navigation.updatePos(pressed);
		},

		updatePos: function( direction ) {
			switch( direction ) {
				case 'down':
					if (this.posVertical === this.numRows) return false;
						this.posVertical++;
					break;
				case 'up':
					if (this.posVertical === 1 ) return false;
						this.posVertical--;
					break;
				case 'left':
					if (this.posHorizontal === 1 ) return false;
						this.posHorizontal--;
					break;
				case 'right':
					if (this.posHorizontal === this.numColumns ) return false;
						this.posHorizontal++;
					break;
				default:
				console.log('Pressed a key that does nothing');
				break;
			}

			Navigation.checkConstraints();
			Navigation.update();
		},

		checkConditions: function( el, condition ){
			if ( condition ){
				el.addClass('inactive');
			} else if (el.hasClass('inactive')) {
				el.removeClass('inactive');
			}
		},

		checkConstraints: function(){
			// this can go a bit backward, it checks them all eventhough you sometimes only want to check one
			var $up =  $('#up'),
				 $down = $('#down'),
				 $left = $('#left'),
				 $right = $('#right');

			this.checkConditions( $up, this.posVertical <= 1 );
			this.checkConditions( $down, this.posVertical >= this.numRows );
			this.checkConditions( $left, this.posHorizontal <= 1  );
			this.checkConditions( $right, this.posHorizontal >= this.numColumns );	
		}
	}

	var Content = {

		loadedPages: [],

		setContent: function( type, container ) {
			// saving current type so that next time it does not load it again
			var gridNum = String( Navigation.posHorizontal ) +  Navigation.posVertical;
			if ( this.loadedPages.indexOf( gridNum ) !== -1 ) return false;
			// if page is new, insert it in the system 
			this.loadedPages.push( gridNum );

			var url;

			switch ( type ){
				case 'flickr':
					url = this.getFlickrUrl();
					this.getJson( url, this.buildFlickrContent, container );
					break;
				case 'reddit':
					url = 'http://www.reddit.com/search.json?q=visualization';
					this.getJson (url, this.buildRedditContent, container);
					break;
				default:
					console.log('content could not be loaded');
					break;
			}

		},

		getJson: function( url, fn, container ) {

			$(".spinner").show();

			$.getJSON(url,function( data ) {
				fn( data, container );
		    })
	   	.error(function() { console.log(" getJson error, url: " + url ); })
		},

		getFlickrUrl: function() {
			var URL = "http://api.flickr.com/services/feeds/photos_public.gne",
				 jsonFormat = "?format=json&jsoncallback=?",
				 ajaxURL = URL + jsonFormat;
			return ajaxURL;
		},

		buildFlickrContent: function( data, container ) {
			var $container = $(container).find('.article-container');

			var dataContainer = document.createElement('div');
			dataContainer.className = 'data-container';
			var $dataContainer = $(dataContainer);

		   var imgPattern = /\<img .+?\/\>/ig;

			$.each(data.items,function( i, photo ) {
				//stripping out img tag to get width height (ratio);
				var result = photo.description.match( imgPattern );

		      var el = '<div class="item">';
		          el += '<div class="item-container flickr"> ' + result + '</div>';
		          el += '</div>';

		      $dataContainer.append( el );
		    }); // end each

			$(".spinner").hide();
			$container.append( $dataContainer );
		},

		buildRedditContent: function( data, container ){
			var $container = $(container).find('.article-container');

			var dataContainer = document.createElement('div');
			dataContainer.className = 'data-container';
			var $dataContainer = $(dataContainer);

		 	$.each( data.data.children.slice(0, 15), function (i, post) {
		 		var el = '<div class="reddit-item">';
		 			 el += '<a href="' + post.data.url + '"><h2>' + post.data.title + '</h2></a>';
		 			 el += '<p>up: ' + post.data.ups + ' down: ' + post.data.downs + '</p>';
                el += '</div>';
 				 $dataContainer.append( el );
            });

			$(".spinner").hide();
		 	$container.append( $dataContainer );
		},

	}
	
	function setWindowSizes(){
	 	var window_width = $(window).width();
	   var window_height = $(window).height();
	   $('section').css('width', window_width + "px");
	   $('section').css('height', window_height + "px");

	   var bodyWidth = window_width * Navigation.numColumns;
	   $('.body-constraint').css('width', bodyWidth);
	}


setWindowSizes();


var nav = document.querySelector('nav');
nav.addEventListener('click', Navigation.onClick);
document.addEventListener("keydown", Navigation.onKeyDown, false);

Navigation.init();


}); // on end ready