

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
	
  $(function () {
    
    let s = location.search
    if (s.length === 0) {
      s = sessionStorage.getItem('utm') || ''
    }
 
    if (s.length === 0) {
      return
    }
    
    while (s.startsWith('?')) { // for cases when searchParam starts with more than one ?
      s = s.substring(1)
    }

    sessionStorage.setItem('utm', s)
    let param = new URLSearchParams(s)

		$('input[name=utm_source]').val(param.get('utm_source'));
		$('input[name=utm_medium]').val(param.get('utm_medium'));
		$('input[name=utm_campaign]').val(param.get('utm_campaign'));
		$('input[name=utm_content]').val(param.get('utm_content'));
    $('input[name=utm_term]').val(param.get('utm_term'));
    
    if (param.get('utm_source').length === 0 && document.referrer.length > 0) {
      $('input[name=utm_source]').val('referer')
      $('input[name=utm_medium]').val(document.referrer)
    }
	});
	
	// Send form
	$('.register-form').on('submit', function(e) {
		let $form = $(this);
    let action = $form.attr('action');
    if (action === 'https://demo.salesdoc.io/site/login') {
      
      if (!$form.hasClass('sent_to_amo')) {
        event.preventDefault()

        let searchParams = new URLSearchParams()
        searchParams.append('name', $form.find('input[name="User[fio]"]').val())
        searchParams.append('company', $form.find('input[name="company_name"]').val())
        searchParams.append('phone', $form.find('input[name="User[tel]"]').val())
        searchParams.append('email', $form.find('input[name="email"]').val())
        searchParams.append('comment', $form.find('input[name="User[comment]"]').val())
        searchParams.append('utm_source', $form.find('input[name=utm_source]').val())
        searchParams.append('utm_campaign', $form.find('input[name=utm_campaign]').val())
        searchParams.append('utm_content', $form.find('input[name=utm_content]').val())
        searchParams.append('utm_term', $form.find('input[name=utm_term]').val())
        searchParams.append('target', $form.find('input[name=target]').val())

        $.ajax('/amocrm/amo.php', {
          method: 'POST',
          data: searchParams.toString(),
          beforeSend: function () {
            $form.find('button').prop('disabled', true);
          },
          complete: function() {
            $form.addClass('sent_to_amo')
            fbq('track', 'SubmitApplication');
            dataLayer = window.dataLayer || [];
            dataLayer.push({'event': 'formSuccess'});
            setTimeout(() => {
              $form.submit();
              $form.find('button').prop('disabled', false);
            }, 500)
          }
        })
      }
        
    }
    else {
      e.preventDefault()
      $.ajax('/amocrm/amo.php', {
        method: 'POST',
        data: $(this).serialize(),
        beforeSend: function () {
          $form.find('button').prop('disabled', true);
        },
        success: function () {
          $form.trigger('reset');
          // @TODO: Show success alert
        },
        complete: function () {
          $form.find('button').prop('disabled', false);
          fbq('track', 'SubmitApplication');
          dataLayer = window.dataLayer || [];
          dataLayer.push({'event': 'formSuccess'});
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

  function checkDomain() {
      const domains = window.location.host.split('.')
      if (domains.length !== 2) {
          window.location.pathname = '/domain_not_exists.html';
      }
  }

  function updateCountryStuffs() {
    $.ajax('country.php', {
      success: function (data) {
        const country_code = data['country_code'];
        if (country_code === 'UZ') {
          
        }
      }
    })
  }

  checkDomain();
  updateCountryStuffs();
	
})();