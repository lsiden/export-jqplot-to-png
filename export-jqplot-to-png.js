$(function() {

  $.fn.jqplotToImage =
  function(x_offset, y_offset) {
    if ($(this).width() == 0 || $(this).height() == 0) {
      return null;
    }
    var newCanvas = document.createElement("canvas");
    newCanvas.width = $(this).outerWidth() + Number(x_offset);
    newCanvas.height = $(this).outerHeight() + Number(y_offset);

    if (!newCanvas.getContext) return null;

    var newContext = newCanvas.getContext("2d"); 
    newContext.textAlign = 'left';
    newContext.textBaseline = 'top';

    function _jqpToImage(el, x_offset, y_offset) {
      var tagname = el.tagName.toLowerCase();
      var p = $(el).position();
      var css = getComputedStyle(el);
      var left = x_offset + p.left + parseInt(css.marginLeft) + parseInt(css.borderLeftWidth) + parseInt(css.paddingLeft);
      var top = y_offset + p.top + parseInt(css.marginTop) + parseInt(css.borderTopWidth)+ parseInt(css.paddingTop);

      if ((tagname == 'div' || tagname == 'span') && !$(el).hasClass('jqplot-highlighter-tooltip')) {
        $(el).children().each(function() {
          _jqpToImage(this, left, top);
        });
        var text = $(el).childText();

        if (text) {
          var metrics = newContext.measureText(text);
          newContext.font = $(el).getComputedFontStyle();
          newContext.fillText(text, left, top);
          // For debugging.
          //newContext.strokeRect(left, top, $(el).width(), $(el).height());
        }
      }
      else if (tagname == 'canvas') {
        newContext.drawImage(el, left, top);
      }
    }
    $(this).children().each(function() {
      _jqpToImage(this, x_offset, y_offset);
    });
    return newCanvas;
  };

  $.fn.css2 = jQuery.fn.css;
  $.fn.css = function() {
    if (arguments.length) return jQuery.fn.css2.apply(this, arguments);
    return window.getComputedStyle(this[0]);
  };

  // Returns font style as abbreviation for "font" property.
  $.fn.getComputedFontStyle = function() {
    var css = this.css();
    var attr = ['font-style', 'font-weight', 'font-size', 'font-family'];
    var style = [];

    for (var i=0 ; i < attr.length; ++i) {
      var attr = String(css[attr[i]]);

      if (attr && attr != 'normal') {
        style.push(attr);
      }
    }
    return style.join(' ');
  }

  $.fn.childText =
    function() {
      return $(this).contents().filter(function() {
        return this.nodeType == 3;  // Node.TEXT_NODE not defined in I7
      }).text();
    };

});
