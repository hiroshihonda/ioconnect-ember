export var rgba = function (colors, intensity) {
  intensity = intensity || 1;

  return "rgba(" + colors.join(',') + ", " + intensity + ")";
};

export var rgb2hex = function(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
};

export var hex = function(colors, intensity) {
  intensity = intensity || 1;

  return rgb2hex(rgba(colors, intensity));
};


export var chartJSColorStack = function (colors) {
  return {
    backgroundColor: rgba(colors, 1),
    borderColor: rgba(colors, 1.25),
    hoverBackgroundColor: rgba(colors, 0.75),
    hoverBorderColor: rgba(colors, 1)
  };
};

export default {
  charts: {
    orange: [255, 204, 102],
    blue: [0, 87, 169],
    green: [48, 169, 0]
  }
};
