// 'var user' (User model) has been declared in EJS
var userView = new UserView({model: user});

window.onload = function(){
	$('#user').css('top', '50px');
	$('#ripple .ghost').css('visibility', 'hidden');
	$('#ripple').css({'top': '42vh', 'right': '13vw'});
	document.body.style.overflow = 'hidden';


	window.bodyOfWater = [];

	var ua = navigator.userAgent.toLowerCase();
	var isMobile = ua.search(/(iphone)|(ipod)|(android)/) !== -1;

	if (isMobile) {
	// function RippleGroup(domElement, scrollFactor, scrollEnd, growthFactor, amplitude, color)

	}
	else {	
	// function RippleGroup(domElement, scrollFactor, scrollEnd, growthFactor, amplitude, color)
		bodyOfWater.push(new DOMRippleGroup({
			domElement: '#ripple .ghost',
			domParentElement: '#ripple .logo',
			numberOfRipples: 4,
			growthFactor: 13,
			frequency: 0.0785,
			styles: {
				visibility: 'visible'
			}
		}));
	}

	$('img').click(function(){
		user.createGuest();
	});

	$('img').hover(function(){
		$('img').css({cursor: 'pointer', opacity: '0.9'});
	}, function(){
		$('img').css({cursor: 'default', opacity: '1'});
	})

}