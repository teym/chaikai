jQuery(document).ready(function ($) {
	if ($.fn.fsvs) {
		var slider = $.fn.fsvs({
			speed: 1000,
			nthClasses: 4,
			mouseDragEvents: false,
			beforeSlide: function (t) {
				if (t === 0) {
					$('#mainNav').removeClass('navbar-scrolled')
				} else {
					$('#mainNav').addClass('navbar-scrolled')
				}
			}
		});
	}

	if ($.fn.flare) {
		var flares = $('.flare').flare();
		for (var flare in flares) {
			//flares[flare].reset();
		}
	}

	var sectionHeight = $('#fsvs-body > .slide:eq(0)').height();
	$('#fsvs-body > .slide').each(function () {
		var section = $(this),
			item = $('.item', section),
			demo = $('.demo', section),
			itemHeight = item.outerHeight(),
			demoHeight = demo.outerHeight();
		item.css({
			marginTop: ((sectionHeight - itemHeight) / 2) + 'px'
		});
		demo.css({
			marginTop: ((sectionHeight - demoHeight) / 2) + 'px'
		});

	});

	$(window).load(function () {
		(function (a, b, c, d, e, j, s) {
			a[d] = a[d] || function () {
				(a[d].a = a[d].a || []).push(arguments)
			};
			j = b.createElement(c),
				s = b.getElementsByTagName(c)[0];
			j.async = true;
			j.charset = 'UTF-8';
			j.src = 'https://static.meiqia.com/widget/loader.js';
			s.parentNode.insertBefore(j, s);
		})(window, document, 'script', '_MEIQIA');
		_MEIQIA('entId', '6c328d6c66f45c74ec9e069445bb97ca');
	});

});