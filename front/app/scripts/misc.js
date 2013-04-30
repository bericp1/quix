'use strict';

window.textFillUpdate = function(max){
  var nMax = max || 86;
  $('.textfill').each(function (i,e) {
    $(e).textfill({maxFontPixels: nMax});
  });
};