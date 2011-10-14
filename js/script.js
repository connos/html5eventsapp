/* Author:

*/


$(document).ready(function(){
	
	// Run Matt Kersley's jQuery Responsive menu plugin (see plugins.js)
	if ($.fn.mobileMenu) {
		$('ol#id').mobileMenu({
			switchWidth: 768,                   // width (in px to switch at)
			topOptionText: 'Choose a page',     // first option text
			indentString: '&nbsp;&nbsp;&nbsp;'  // string for indenting nested items
		});
	}

	// Run Mathias Bynens jQuery placeholder plugin (see plugins.js)
	if ($.fn.placeholder) {
		$('input, textarea').placeholder();		
	}
	
	var vpheight = $(window).height();
	var vpwidth = $(window).width();
	$('#event-form-wrapper').css('min-height', vpheight - 40)
console.log(vpwidth);

	if(vpwidth <= 767){
	 
	
		$('#my-events-wrapper li').click(function(){
			
			$('#my-events-wrapper').animate({
			    left: '-' + vpwidth
			  }, 1000, function() {
			    $(this).hide();
			  });
			  
			$('#event-form-wrapper').show().animate({
			    left: '0'
			  }, 1000, function() {
			  	$('nav li:first-child').show();
			  });
		});
		
		$('nav a:first-child').click(function(){
			$('#event-form-wrapper').animate({
			    left: '100%'
			  }, 1000, function() {
			    $(this).hide();
			  });
			  
			$('#my-events-wrapper').show().animate({
			    left: '0'
			  }, 1000, function() {
			    $('nav li:first-child').hide();
			  });
			return false;
		});
		
	}
});







