var mainsitehost = document.getElementById("mainsitehost").value;
  var plaintextSiteHost = document.getElementById("plaintextSiteHost").value;



  var highest_protocol = -1;

  function find_xhr() {
    // http://stackoverflow.com/questions/305894/best-practice-for-detecting-ajax-xmlhttprequestsupport
    var xhr = null;
    try { xhr = new XMLHttpRequest(); } catch (e) {}
    try { xhr = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
    try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
    return (xhr!=null);
  }

  // If there's a hashtag in the URL, remove it. We need a clean
  // URL in order to detect a message from the frame.
  // Commented to avoid multiple redirect issue in IE
/*  if (location.href.indexOf('#') != -1) {
    location = 'viewMyClient.html';
  }*/

  var time = new Date().getTime();

  // Add a plaintext image to the page.
  var img = jQuery('<img />');
  jQuery(img).bind({
    load: function() {
      jQuery('#mixedImages').text('Yes');
      jQuery('#mixedImages').css('color', '#F88017');
    },
    error: function() {
      jQuery('#mixedImages').text('No');
    }
  });

  jQuery('#hiddenImagesDiv').append(img);

  try {
    jQuery(img).attr('src', 'http://'+plaintextSiteHost+'/plaintext/1x1-transparent.png?t=' + time);
  } catch(err) {
    // Strict mixed content restrictions might create
    // an error here and break the entire page.
    jQuery('#mixedImages').text('No');
  }

  // Test SSL 2
  jQuery('#protocol_ssl2').text('Testing...');

  var img = jQuery('<img />');
  jQuery(img).bind({
    load: function() {
      jQuery('#protocol_ssl2').text('Yes');
      jQuery('#protocol_ssl2').css('color', 'red');
      jQuery('#protocol_ssl2_label').css('color', 'red');
	    jQuery('#ssl2TestDiv').css('display', 'block');

      if ((highest_protocol == -1)||(highest_protocol < 0x0200)) {
        highest_protocol = 0x0200;
      }
    },
    error: function() {
      jQuery('#protocol_ssl2').text('No');
      jQuery('#protocol_ssl2').css('color', 'black');
    }
  });

  jQuery('#hiddenImagesDiv').append(img);
  jQuery(img).attr('src','https://'+mainsitehost+':10200/1x1-transparent.png?t=' + time);

  // Test Logjam
  var img = jQuery('<img />');
  jQuery(img).bind({
    load: function() {
      jQuery('#jamTestMsg').text('Your user agent is vulnerable. Upgrade as soon as possible.');
      jQuery('#jamTestMsg').css('color', 'red');
    },
    error: function() {
      jQuery('#jamTestMsg').text('Your user agent is not vulnerable.');
    }
  });

  jQuery('#hiddenImagesDiv').append(img);
  jQuery(img).attr('src','https://'+mainsitehost+':10445/ssl-labs-logo.gif?t=' + time);

  // Test FREAK
  var img = jQuery('<img />');
  jQuery(img).bind({
    load: function() {
      jQuery('#freakTestMsg').text('Your user agent is vulnerable. Upgrade as soon as possible.');
      jQuery('#freakTestMsg').css('color', 'red');
    },
    error: function() {
      jQuery('#freakTestMsg').text('Your user agent is not vulnerable.');
    }
  });

  jQuery('#hiddenImagesDiv').append(img);
  jQuery(img).attr('src','https://'+mainsitehost+':10444/ssl-labs-logo.gif?t=' + time);

  // Test SSL 3
  jQuery('#protocol_ssl3').text('Testing...');

  var img = jQuery('<img />');
  jQuery(img).bind({
    load: function() {
      jQuery('#protocol_ssl3').text('Yes');
      jQuery('#protocol_ssl3').css('color', 'red');
      jQuery('#protocol_ssl3_label').css('color', 'red');
      jQuery('#ssl3TestMsg').text('Your user agent is vulnerable. You should disable SSL 3.');
      jQuery('#ssl3TestMsg').css('color', 'red');

      if ((highest_protocol == -1)||(highest_protocol < 0x0300)) {
        highest_protocol = 0x0300;
      }
    },
    error: function() {
      jQuery('#protocol_ssl3').text('No');
      jQuery('#protocol_ssl3').css('color', 'black');
      jQuery('#ssl3TestMsg').text('Your user agent is not vulnerable.');
    }
  });

  jQuery('#hiddenImagesDiv').append(img);
  jQuery(img).attr('src','https://'+mainsitehost+':10300/1x1-transparent.png?t=' + time);

  // Test TLS 1.0
  jQuery('#protocol_tls1').text('Testing...');

  var img = jQuery('<img />');
  jQuery(img).bind({
    load: function() {
      jQuery('#protocol_tls1').text('Yes');
      jQuery('#protocol_tls1').css('color', 'black');
      if ((highest_protocol == -1)||(highest_protocol < 0x0301)) {
        highest_protocol = 0x0301;
      }
    },
    error: function() {
      jQuery('#protocol_tls1').text('No');
      jQuery('#protocol_tls1').css('color', 'black');
    }
  });

  jQuery('#hiddenImagesDiv').append(img);
  jQuery(img).attr('src','https://'+mainsitehost+':10301/1x1-transparent.png?t=' + time);

  // Test TLS 1.1
  jQuery('#protocol_tls1_1').text('Testing...');

  var img = jQuery('<img />');
  jQuery(img).bind({
    load: function() {
      jQuery('#protocol_tls1_1').text('Yes');
      jQuery('#protocol_tls1_1').css('color', 'black');
      if ((highest_protocol == -1)||(highest_protocol < 0x0302)) {
        highest_protocol = 0x0302;
      }
    },
    error: function() {
      jQuery('#protocol_tls1_1').text('No');
      jQuery('#protocol_tls1_1').css('color', 'black');
    }
  });

  jQuery('#hiddenImagesDiv').append(img);
  jQuery(img).attr('src','https://'+mainsitehost+':10302/1x1-transparent.png?t=' + time);

  // Test TLS 1.2
  jQuery('#protocol_tls1_2').text('Testing...');

  var img = jQuery('<img />');
  jQuery(img).bind({
    load: function() {
      jQuery('#protocol_tls1_2').text('Yes');
      jQuery('#protocol_tls1_2').css('color', 'green');
      jQuery('#protocol_tls1_2_label').css('color', 'green');

      if ((highest_protocol == -1)||(highest_protocol < 0x0303)) {
        highest_protocol = 0x0303;
      }
    },
    error: function() {
      jQuery('#protocol_tls1_2').text('No');
      jQuery('#protocol_tls1_2').css('color', 'black');
    }
  });

  jQuery('#hiddenImagesDiv').append(img);
  jQuery(img).attr('src','https://'+mainsitehost+':10303/1x1-transparent.png?t=' + time);

  // Add a plaintext script to the page.
  mixed_script_loaded = false;
  var script = jQuery('<script type="text/javascript" src="http://'+plaintextSiteHost+'/plaintext/script.js?t=' + time + '"></script>');
  jQuery('head').append(script);

  // Add a plaintext stylesheet to the page.
  var css = jQuery('<link rel="styleSheet" type="text/css" href="http://'+plaintextSiteHost+'/plaintext/style1.css?t=' + time + '">');
  jQuery('head').append(css);

  // Mixed XHR

  if (find_xhr() == null) {
    jQuery('#mixedXhr').text('N/A');
  } else {
    jQuery.ajax({
      type: 'GET',
      url: 'http://'+plaintextSiteHost+'/plaintext/xhr.txt?t=' + time,
      timeout: 5000,

      success: function(response, status) {
        jQuery('#mixedXhr').text('Yes');
        jQuery('#mixedXhr').css('color', 'red');
      },

      error: function(jqXHR, status, errorMessage) {
        if (status == 'timeout') {
          jQuery('#mixedXhr').text('No (timeout)');
        } else {
          jQuery('#mixedXhr').text('No');
        }
      }
    });
  }



  // Determine which of the plaintext resources loaded.
  function check_test_success() {
    // Mixed scripts
    if (mixed_script_loaded) {
      jQuery('#mixedScripts').text('Yes');
      jQuery('#mixedScripts').css('color', 'red');
    } else {
      jQuery('#mixedScripts').text('No');
    }

    // Mixed CSS
    var mixed_css_color1 = jQuery('#mixedCSSHiddenDiv1').css('color');
    if (mixed_css_color1.indexOf('255') != -1) {
      jQuery('#mixedCssLink').text('Yes');
      jQuery('#mixedCssLink').css('color', 'red');
    } else {
      jQuery('#mixedCssLink').text('No');
    }

    // Mixed frames
    if (location.href.indexOf('frame_loaded') != -1) {
      jQuery('#mixedFrame').text('Yes');
      jQuery('#mixedFrame').css('color', 'red');
    } else {
      jQuery('#mixedFrame').text('No');
    }

    if (jQuery('#mixedWebSockets').text() == 'Testing...') {
      jQuery('#mixedWebSockets').text('Test failed');
    }

    if (highest_protocol == -1) {
      jQuery('#protocol_ssl2').text('Firewall');
      jQuery('#protocol_ssl2').css('color', 'red');
      jQuery('#protocol_ssl3').text('Firewall');
      jQuery('#protocol_ssl3').css('color', 'red');
      jQuery('#protocol_tls1').text('Firewall');
      jQuery('#protocol_tls1').css('color', 'red');
      jQuery('#protocol_tls1_1').text('Firewall');
      jQuery('#protocol_tls1_1').css('color', 'red');
      jQuery('#protocol_tls1_2').text('Firewall');
      jQuery('#protocol_tls1_2').css('color', 'red');

      jQuery('#ssl3TestDiv').css('display', 'hidden');
      //jQuery('#protocolTestDiv').css('display', 'block');
      jQuery('#freakTestDiv').css('display', 'hidden');
      jQuery('#jamTestDiv').css('display', 'hidden');

      jQuery('#protocolTestHeading').text('Partial Test Failure');
      jQuery('#protocolTestMsg').text('Failed, probably due to firewall restrictions');
      jQuery('#protocolTestMsg').css('color', 'red');
      jQuery('#protocolTestMsgNotes').text('We couldn\'t detect any secure protocols. Many of our tests run on non-standard protocols; it\'s possible that you are in an environment that limits outbound connections, thus breaking our tests. If possible, try this test in a different environment.');
    } else {
      if (highest_protocol == 0x0303) {
        jQuery('#protocolTestMsg').text('Your user agent has good protocol support.');
        jQuery('#protocolTestMsg').css('color', 'green');
        jQuery('#protocolTestMsgNotes').text('Your user agent supports TLS 1.2, which is the best available protocol version at the moment.');
      } else {
        jQuery('#protocolTestMsg').text('Your user agent doesn\'t support TLS 1.2. You should upgrade.');
        jQuery('#protocolTestMsg').css('color', 'red');
        jQuery('#protocolTestMsgNotes').text('The protocols supported by your user agent are old and have known vulnerabilities. You should upgrade as soon as possible. The latest versions of Chrome, Firefox, and IE are all good choices. If you can\'t upgrade IE to version 11, we recommend that you try Chrome or Firefox on your platform.');
      }
    }
  }

  function check_mixed_content1() {
    // Check the success of mixed tests only after this
    // control image (which is expected to always work) loads.

    var img2 = jQuery('<img />');
    jQuery(img2).bind({
      load: function() {
        check_test_success();
      },
      error: function() {
        // If we fail to load this image, then fail the pending tests.
        jQuery('#mixedScripts').text('Test failed');
        jQuery('#mixedCssLink').text('Test failed');
        jQuery('#mixedFrame').text('Test failed');
        if (jQuery('#mixedWebSockets').text() == 'Testing...') {
          jQuery('#mixedWebSockets').text('Test failed');
        }
      }
    });

    jQuery('#hiddenImagesDiv').append(img2);
    jQuery(img2).attr('src','https://'+mainsitehost+'/plaintext/1x1-transparent.png?t=' + time);

  }

  jQuery(document).ready(function() {

    jQuery('#mixedDiv').css('display', 'block');

    // The mixed content tests are in progress; delay the
    // success check in order to give them time to finish.
    setTimeout(function(){
      check_mixed_content1();}, 1000);
  });




 // WebSockets Test

  if (window.WebSocket == undefined) {
    jQuery('#mixedWebSockets').text('N/A');
  } else {
    try {
      var ws = new WebSocket('wss://'+mainsitehost+'/plaintext/ping');
      ws.onopen = function(e) {
        ws.send('ping');
      }
      ws.onmessage = function(e) {
        //alert('secure: ' + e.data);

        try {
          var ws2 = new WebSocket('ws://'+plaintextSiteHost+'/plaintext/ping');
          ws2.onopen = function(e) {
            ws2.send('ping');
          }
          ws2.onmessage = function(e) {
            jQuery('#mixedWebSockets').text('Yes');
            jQuery('#mixedWebSockets').css('color', 'red');
            ws2.close();
          }
        } catch(e2) {
          // Exception thrown in Firefox: "This operation is insecure"
          jQuery('#mixedWebSockets').text('No');
        }

        ws.close();
      }
    } catch(e) {
      jQuery('#mixedWebSockets').text('N/A');
    }
  }
