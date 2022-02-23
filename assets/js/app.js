

(function () {
  'use strict'; //preloader

  $(window).ready(function () {
    $('#preloader').delay(100).fadeOut('fade');
  }); //dropdown menu hover js

  $('ul.nav li.dropdown').hover(function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(200);
  }, function () {
    $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(200);
  }); //sticky header

  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();

    if (scroll < 20) {
      $('nav.sticky-header').removeClass('affix');
    } else {
      $('nav.sticky-header').addClass('affix');
    }
  }); //swiper slide js

  var swiper = new Swiper('.testimonialSwiper', {
    slidesPerView: 2,
    speed: 700,
    spaceBetween: 30,
    slidesPerGroup: 2,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      640: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 25
      },
      1142: {
        slidesPerView: 2,
        spaceBetween: 30
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }); //app two review slider

  var swiper = new Swiper('.appTwoReviewSwiper', {
    slidesPerView: 2,
    speed: 700,
    spaceBetween: 30,
    slidesPerGroup: 2,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      991: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });

  $(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
  }); //animated js

  AOS.init({
    easing: 'ease-in-out',
    // default easing for AOS animations
    once: true,
    // whether animation should happen only once - while scrolling down
    duration: 500 // values from 0 to 3000, with step 50ms

  }); //magnific popup js

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });
	
  $('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#name'
  });
	
	$(function() {
		$('input[name=utm_source]').val(getParameterByName('utm_source'));
		$('input[name=utm_medium]').val(getParameterByName('utm_medium'));
		$('input[name=utm_campaign]').val(getParameterByName('utm_campaign'));
		$('input[name=utm_content]').val(getParameterByName('utm_content'));
		$('input[name=utm_term]').val(getParameterByName('utm_term'));
	});
	
	// Send form
	$('.register-form').on('submit', function(e) {
		let $form = $(this);
    let action = $form.attr('action');
    if (action === 'https://demo.salesdoc.io/site/login') {
      
      if (!$form.hasClass('sent_to_amo')) {
        event.preventDefault()
        const full_name = $form.find('input[name="User[fio]"]').val();
        const company_name = $form.find('input[name="company_name"]').val();
        const phone = $form.find('input[name="User[tel]"]').val();
        const email = $form.find('input[name="email"]').val();
        const comment = $form.find('input[name="User[comment]"]').val();

        $.ajax('handler.php', {
          method: 'POST',
          data: `full_name=${full_name}&company_name=${company_name}&phone=${phone}&email=${email}&comment=${comment}`,
          complete: function() {
            $form.addClass('sent_to_amo')
            $form.submit();
            fbq('track', 'SubmitApplication');
            dataLayer = window.dataLayer || [];
            dataLayer.push({'event': 'formSuccess'});
          }
        })
      }
        
    }
    else {

      e.preventDefault()
      $.ajax('handler.php', {
        method: 'POST',
        data: $(this).serialize(),
        beforeSend: function () {
          $form.find('button').prop('disabled', true);
        },
        success: function () {
          $form.trigger('reset');
          fbq('track', 'SubmitApplication');
          dataLayer = window.dataLayer || [];
          dataLayer.push({'event': 'formSuccess'});
        },
        complete: function () {
          $form.find('button').prop('disabled', false);
        }
      });
    }
		
	});
	
	// Parse the URL
	function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
})();