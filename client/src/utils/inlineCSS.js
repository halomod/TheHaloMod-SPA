/* eslint-disable */
import * as d3 from 'd3';

/**
 * Adds inline CSS styles to the D3 SVG element by extracting
 * style properties using Window.getComputedStyles.
 * 
 * @param {Array} elements array of elements and style properties
 */
export default (elements) => {
	if(elements && elements.length) {
		elements.forEach(function(d) {
    	d3.selectAll(d.el).each(function(){
        var element = this;
        if(d.properties && d.properties.length) {
          d.properties.forEach(function(prop) {
              var computedStyle = getComputedStyle(element, null),
                value = computedStyle.getPropertyValue(prop);
              element.style[prop] = value;
          });
        }
       });
    });
  }
};

