window.setCookie = function(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

window.getCookie = function(c_name){
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++) {
  		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  		x=x.replace(/^\s+|\s+$/g,"");
  		if (x==c_name) {
    		return unescape(y);
    	}
  	}
  	return null;
}

window.dateFormat =function(format, date) {
  if (date == undefined) {
    date = new Date();
  }
  if (typeof date == 'number') {
    time = new Date();
    time.setTime(date);
    date = time;
  } else if (typeof date == 'string') {
    date = new Date(date);
  }
  var fullYear = date.getYear();
  if (fullYear < 1000) {
    fullYear = fullYear + 1900;
  }
  var hour = date.getHours();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var minute = date.getMinutes();
  var seconde = date.getSeconds();
  var milliSeconde = date.getMilliseconds();
  var reg = new RegExp('(d|m|Y|H|i|s)', 'g');
  var replacement = new Array();
  replacement['d'] = day < 10 ? '0' + day : day;
  replacement['m'] = month < 10 ? '0' + month : month;
  replacement['Y'] = fullYear;
  replacement['Y'] = fullYear;
  replacement['H'] = hour < 10 ? '0' + hour : hour;
  replacement['i'] = minute < 10 ? '0' + minute : minute;
  replacement['s'] = seconde < 10 ? '0' + seconde : seconde;
  return format.replace(reg, function($0) {
    return ($0 in replacement) ? replacement[$0] : $0.slice(1,
        $0.length - 1);
  });
}

$.fn.serializeObject = function() {
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
}

window.userIsLoggedIn = function(options) {
  window.userIsLoggedInWithRoles([], options);
}

window.userIsLoggedInWithRoles = function(roles, options) {

  // Define options and roles
  options || (options = {});
  roles || (roles = []);

  var success = options.success;
  options.success = function(model) {
    if(success) success(model);
  }
  var error = options.error;
  options.error = function(err) {
    if(error) error(err);
  }

  // Try to get cookies
  var userId = getCookie("user-id");
  var userLastLogin = getCookie("user-last-login");

  // If cookies were not found
  if(!userId || !userLastLogin) {
    options.error();
  } 

  // If cookies were found
  else {

    // Try to retrieve user from database
    var user = new UserModel({_id: userId});
    user.fetch({

      // If user was found
      success: function(model) {

        // Check if user last login timestamp is correct
        if(model.get('lastLogin') == userLastLogin) {

          var hasRoles = 0;

          // Iterate on each required role
          _.each(roles, function(role){   
            var containsRole = (_.indexOf(model.get('roles'), role) > -1);
            if(containsRole) hasRoles ++;
          });

          if(hasRoles == roles.length) {
            options.success(model);
          } else {
            options.error();
          }
        } else {
          options.error();
        }
      },

      // If user was not found
      error: function(err) {
        options.error(err);
      }

    });

  } // end else

}