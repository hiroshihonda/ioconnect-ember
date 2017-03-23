/**
 * main map setup
 */

var map;					// google map
var index = 0;				// index of panel in panel[]
var hincrementcpy = 0.0;	// so panels won't overlap when added
var vincrementcpy = 0.0;
var hincrement = 0.0;		// so panels won't overlap when added
var vincrement = 0.0;
var row = 0;
var col = 0;
var numPanels = 0;			// total number of panels on the map
var selecting = false;		// bool for ctrl key
var typedAddress = false;
var earthRadius = 6371;		//radius in km
var panelwidth = 0.000011; //the panels width. referenced by addpanelarray
var panellength = 0.0000149;
var toplength = 5; //stores length of top of proportionial poly
var sidelength = 1; //stores length of left side of proportionial poly
var isARectangle = false;
var isATriangle = false;

var panel = [];				// array of all added panels

// first 4 latitude points
var latPoints = {
	northwest : 0.0,
	northeast : 0.0,
	southeast : 0.0,
	southwest : 0.0
};

// first 4 longitude points
var lngPoints = {
	northwest : 0.0,
	northeast : 0.0,
	southeast : 0.0,
	southwest : 0.0
};

var autocomplete;
var drawingManager;

var mapPlace;
var mapZoom;

var hIncrement = 0.000011;
var vIncrement = 0.0000149;

/**************************************************
 * function - initMap()
 * purpose - initializes the map object by setting
 * 			the center of the map. Also initializes
 * 			the geocoder to find an address.
 * parameters - none
 * returns - none
 * side effects - none
 **************************************************/
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		// center map on USA
		center : {
			lat : 39.833333,
			lng : -98.583333
		},
		// max zoom is ~20, min zoom is 0
		zoom : 13,
		// initialize tilt to 0
		tilt : 0,
		// cannot change map type from hybrid
		mapTypeControl : false,
		// cannot control street view
		streetViewControl : false,
		// cannot use the tilt function
		rotateControl : false,
		// map default is hybrid (satellite mixed with road)
		mapTypeId : google.maps.MapTypeId.SATELLITE
	}); // end var map init
	
	drawingManager = new google.maps.drawing.DrawingManager({
		//drawingMode : google.maps.drawing.OverlayType.MARKER,
		drawingControl : false,
		drawingControlOptions : {
			position : google.maps.ControlPosition.BOTTOM_CENTER,
			drawingModes : [ google.maps.drawing.OverlayType.POLYGON ]
		},
		polygonOptions : {
			fillColor : '#0066cc',
			fillOpacity : 0.3,
			strokeColor : '#0066cc',
			strokeWeight : 2,
			clickable : true,
			editable : true,
			zIndex : 1
		}
	});

	var input = (document.getElementById('pac-input'));

	var types = document.getElementById('type-selector');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

	autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

	autocomplete.addListener('place_changed', placeChanged);
	
	// Sets a listener on a radio button to change the filter type on Places
	// Autocomplete.
	function setupClickListener(id, types) {
		var radioButton = document.getElementById(id);
		if(radioButton)
		radioButton.addEventListener('click', function() {
			autocomplete.setTypes(types);
		});
	}

	setupClickListener('changetype-all', []);
	setupClickListener('changetype-address', [ 'address' ]);
	setupClickListener('changetype-establishment', [ 'establishment' ]);
	setupClickListener('changetype-geocode', [ 'geocode' ]);
	
}
//end initMap
	
function placeChanged() {
		var place = arguments.length > 0? arguments[0] : autocomplete.getPlace();
		if (!place || !place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
		}
		
		mapPlace = place;

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			var maxZoom = new google.maps.MaxZoomService();
			maxZoom.getMaxZoomAtLatLng(place.geometry.location, function(
					response) {
						mapZoom = response.zoom;
				map.setZoom(response.zoom);
			})
			document.getElementById("menu").style.visibility = "visible";
			drawingManager.setMap(map);
		}

		latPoints.northwest = latPoints.northeast = place.geometry.location
				.lat();
		latPoints.southeast = latPoints.southwest = place.geometry.location
				.lat() - vIncrement;
		lngPoints.northwest = lngPoints.southwest = place.geometry.location
				.lng();
		lngPoints.southeast = lngPoints.northeast = place.geometry.location
				.lng() + hIncrement;
		typedAddress = true;

		var address = '';
		if (place.address_components) {
			address = [
					(place.address_components[0]
							&& place.address_components[0].short_name || ''),
					(place.address_components[1]
							&& place.address_components[1].short_name || ''),
					(place.address_components[2]
							&& place.address_components[2].short_name || '') ]
					.join(' ');
		}
}

function _addPanel(panelInfo) {
	addPanel();
	panel[index].azimuth = panelInfo.azimuth;
	panel[index].tilt = panelInfo.tilt;
	
	panel[index].setOptions({
		paths: panelInfo.paths
	});
}	



/* ADD PANEL */

/**************************************************
 * function - addPanel()
 * purpose - adds a panel to the map
 * parameters - none
 * returns - none
 * side effects - changes lat long coordinates
 **************************************************/
function addPanel() {

	index++;
	numPanels++;
	var isCopied = false;
	
	panel[index] = new google.maps.Polygon;
	panel[index].azimuth = 0;
	panel[index].tilt = 0;
	panel[index].selected = false;
	panel[index].length = vIncrement;
	panel[index].width = hIncrement;
		
	if (index == 1) {
		panel[index].setOptions({
			paths : [ {
				lat : latPoints.northwest,
				lng : lngPoints.northwest
			}, {
				lat : latPoints.northeast,
				lng : lngPoints.northeast
			}, {
				lat : latPoints.southeast,
				lng : lngPoints.southeast
			}, {
				lat : latPoints.southwest,
				lng : lngPoints.southwest
			}, {
				lat : latPoints.northwest,
				lng : lngPoints.northwest
			} ]
		});
		col++;
		hincrement = col * hIncrement;
	} else {
		// copy panel
		for (var i = 1; i < index; i++) {
			if (panel[i].selected) {
				var latnw = panel[i].getPath().getAt(0).lat();
				var latne = panel[i].getPath().getAt(1).lat();
				var latse = panel[i].getPath().getAt(2).lat();
				var latsw = panel[i].getPath().getAt(3).lat();

				var lngnw = panel[i].getPath().getAt(0).lng();
				var lngne = panel[i].getPath().getAt(1).lng();
				var lngse = panel[i].getPath().getAt(2).lng();
				var lngsw = panel[i].getPath().getAt(3).lng();

				panel[i].selected = false;
				panel[index].selected = true;

				panel[index].azimuth = panel[i].azimuth;
				panel[index].tilt = panel[i].tilt;
				isCopied = true;

				hincrementcpy = Math.cos(-1 * rad(panel[index].azimuth))
						* (panel[index].width);
				vincrementcpy = Math.sin(-1 * rad(panel[index].azimuth))
						* (panel[index].width);

				panel[index].setOptions({
					paths : [ {
						lat : latnw + vincrementcpy,
						lng : lngnw + hincrementcpy
					}, {
						lat : latne + vincrementcpy,
						lng : lngne + hincrementcpy
					}, {
						lat : latse + vincrementcpy,
						lng : lngse + hincrementcpy
					}, {
						lat : latsw + vincrementcpy,
						lng : lngsw + hincrementcpy
					}, {
						lat : latnw + vincrementcpy,
						lng : lngnw + hincrementcpy
					} ]
				});
				break;
			} else if (i == index - 1) {

				panel[index].setOptions({
					paths : [ {
						lat : latPoints.northwest + vincrement,
						lng : lngPoints.northwest + hincrement
					}, {
						lat : latPoints.northeast + vincrement,
						lng : lngPoints.northeast + hincrement
					}, {
						lat : latPoints.southeast + vincrement,
						lng : lngPoints.southeast + hincrement
					}, {
						lat : latPoints.southwest + vincrement,
						lng : lngPoints.southwest + hincrement
					}, {
						lat : latPoints.northwest + vincrement,
						lng : lngPoints.northwest + hincrement
					} ]
				});

				col = (col + 1) % toplength;
				if (col == 0) {
					row++;
				}

				hincrement = col * hIncrement;
				vincrement = row * -vIncrement;
			}
		}
	}
	
	panel[index].setOptions({
		strokeOpacity : 1,
		strokeWeight : 0.3,
		fillOpacity : 0.7,
		draggable : true,
		geodesic : false,
		editable : false,
		clickable : true,
		zIndex : 2
	});

	panel[index].startPath = panel[index].getPath();
	
	for (var j = 1; j <= index; j++) {
		if (panel[j].selected) {
			panel[j].setOptions({
				strokeColor : '#00FF00',
				fillColor : '#00FF00'
			});
		} else {
			panel[j].setOptions({
				strokeColor : '#fff',
				fillColor : '#000033'
			});
		}
	}
	
	panel[index].setMap(map);
	
	google.maps.event.addListener(panel[index], 'click', function(e) {
		// ctrl pushed down
		if (selecting) {
			if (!this.selected) {
				this.setOptions({
					strokeColor : '#00FF00',
					fillColor : '#00FF00'
				});
				this.selected = true;
			} else {
				this.setOptions({
					strokeColor : '#fff',
					fillColor : '#000033'
				});
				this.selected = false;
			}
			// ctrl not pushed down
		} else {
			if(this.selected) {
				this.selected = false;
				this.setOptions({
					strokeColor : '#fff',
					fillColor : '#000033'
				});
			} else {
				this.selected = true;
				this.setOptions({
					strokeColor : '#00FF00',
					fillColor : '#00FF00'
				});
			}
			for (var i = 1; i <= index; ++i) {
				if (this != panel[i]) {
					panel[i].setOptions({
						strokeColor : '#fff',
						fillColor : '#000033'
					});
					panel[i].selected = false;
				}
			}
		}
		updatePanelInfo(this);
	});
	
	updatePanelInfo(panel[index]);
}

function addArray() {
	for (var i = 0; i < 5; ++i) {
		addPanel();
	}
}

function selectAll(){
	for (var i = 1; i <= index; ++i) {
		panel[i].selected = true;
		panel[i].setOptions({
			strokeColor : '#00ff00',
			fillColor : '#00ff00'
		});
	}
}


/* REMOVE PANEL */

/*******************************************************************************
 * function - removePanel()
 * purpose - removes a panel to the map
 * parameters - none
 * returns - none
 * side effects - none
 ******************************************************************************/
function removePanel() {
	for (var i = 1; i <= index; ++i) {
		if (panel[i].selected) {
			panel[i].setMap(null);
			numPanels--;
		}
	}
	if (numPanels <= 0) {
		numPanels = 0;
	}
	updatePanelInfo(panel[i]);
}

function removeAll() {
	for (var i = 1; i <= index; ++i) {
		panel[i].setMap(null);
	}
	numPanels = 0;
	index = 1;
}

/* TILT */
function tiltPanel(tilt, typedInput) {
	if (typedInput) {
		var temp = document.getElementsByName("tilt")[0].value;
		tilt = parseInt(temp);
	}
	for (var i = 1; i <= index; ++i) {
		if (panel[i].selected) {
			if (typedInput) {
				if (tilt <= 90 && tilt >= 0) {
					panel[i].tilt = tilt;
				}
			} else {
				if (panel[i].tilt <= 90 && panel[i].tilt >= 0) {
					panel[i].tilt += tilt;
					if (panel[i].tilt < 0)
						panel[i].tilt = 0;
					if (panel[i].tilt > 90)
						panel[i].tilt = 90;
				}
			}
		}
	}
}


function _rotatePanel(i, firstSelected, angle, typedInput)
{
	var cx, cy, ul, ur, lr, ll;

	// rotating about point (cx, cy)
	cx = panel[firstSelected].getPath().getAt(0).lng();
	cy = panel[firstSelected].getPath().getAt(0).lat();

	if (!typedInput) {
		ul = rotate(cx, cy, panel[i].getPath().getAt(0).lng(), panel[i]
				.getPath().getAt(0).lat(), angle);
		ur = rotate(cx, cy, panel[i].getPath().getAt(1).lng(), panel[i]
				.getPath().getAt(1).lat(), angle);
		lr = rotate(cx, cy, panel[i].getPath().getAt(2).lng(), panel[i]
				.getPath().getAt(2).lat(), angle);
		ll = rotate(cx, cy, panel[i].getPath().getAt(3).lng(), panel[i]
				.getPath().getAt(3).lat(), angle);

		panel[i].azimuth += angle;

		if (panel[i].azimuth < 0) {
			panel[i].azimuth += 360;
		}
	} else {
		ul = rotate(cx, cy, panel[i].startPath.getAt(0).lng(),
				panel[i].startPath.getAt(0).lat(), angle);
		ur = rotate(cx, cy, panel[i].startPath.getAt(1).lng(),
				panel[i].startPath.getAt(1).lat(), angle);
		lr = rotate(cx, cy, panel[i].startPath.getAt(2).lng(),
				panel[i].startPath.getAt(2).lat(), angle);
		ll = rotate(cx, cy, panel[i].startPath.getAt(3).lng(),
				panel[i].startPath.getAt(3).lat(), angle);

		panel[i].azimuth = angle;
	}

	var paths = new google.maps.MVCArray([
			new google.maps.LatLng(ul[1], ul[0]), // north west
			new google.maps.LatLng(ur[1], ur[0]), // north east
			new google.maps.LatLng(lr[1], lr[0]), // south east
			new google.maps.LatLng(ll[1], ll[0]), // south west
			new google.maps.LatLng(ul[1], ul[0]) ]);

	panel[i].setPaths(paths);

	panel[i].setMap(map);
}

/* ROTATION */

/*******************************************************************************
 * function - rotatePanel()
 * purpose - rotates a panel
 * parameters - angle: how many dgrees to rotate the panel
 * 				typedInput: did the user click a button or type the angle?
 * returns - none
 * side effects - none
 ******************************************************************************/
function rotatePanel(angle, typedInput) {
	
	var firstSelected;

	for (var i = 1; i <= index; ++i) {
		if (panel[i].selected) {
			firstSelected = i;
			break;
		}
	}

	for (var i = 1; i <= index; ++i) {

		if (panel[i].selected) {
			if (!typedInput) {
				rotatePolygon(panel[firstSelected],panel[i],angle,map);

				panel[i].azimuth += angle;

				if (panel[i].azimuth < 0) {
					panel[i].azimuth += 360;
				}
			} else {
				rotatePolygon(panel[firstSelected],panel[i],angle,map);

				panel[i].azimuth = angle;
			};
			
			/*
			var paths = new google.maps.MVCArray([
					new google.maps.LatLng(ul[1], ul[0]), // north west
					new google.maps.LatLng(ur[1], ur[0]), // north east
					new google.maps.LatLng(lr[1], lr[0]), // south east
					new google.maps.LatLng(ll[1], ll[0]), // south west
					new google.maps.LatLng(ul[1], ul[0]) ]);

			panel[i].setPaths(paths);


			panel[i].setMap(map);
			*/
		}
	}
}

function userAngle() {
	var temp = document.getElementsByName("rotation")[0].value;
	var angle = parseInt(temp);
	if(angle >= 0)
		rotatePanel(angle, true);
}

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

function rotatePoint(point, origin, angle) {
    var angleRad = angle * Math.PI / 180.0;
    return {
        x: Math.cos(angleRad) * (point.x - origin.x) - Math.sin(angleRad) * (point.y - origin.y) + origin.x,
        y: Math.sin(angleRad) * (point.x - origin.x) + Math.cos(angleRad) * (point.y - origin.y) + origin.y
    };
}

function rotatePolygon(firstSelected,polygon,angle,map) {
    var map = polygon.getMap();
    var prj = map.getProjection();
    var origin = prj.fromLatLngToPoint(firstSelected.getPath().getAt(0)); //rotate around geometric center of polygon

    var coords = polygon.getPath().getArray().map(function(latLng){
       var point = prj.fromLatLngToPoint(latLng);
       var rotatedLatLng =  prj.fromPointToLatLng(rotatePoint(point,origin,angle));
       return {lat: rotatedLatLng.lat(), lng: rotatedLatLng.lng()};
    });
    polygon.setPath(coords);
	polygon.setMap(map);
}


/* UPDATE INFO OF SELECTED PANEL */

function updatePanelInfo(p) {
	document.getElementById("numPanels").innerHTML = "Panels: " + numPanels;
	document.getElementById("azimuth").innerHTML = "Azimuth: "
			+ p.azimuth % 360 + "&deg";
	document.getElementById("tilt").innerHTML = "Tilt: "
			+ p.tilt + "&deg";
}




/* SELECTING PANELS */

function keyboardShortcuts(e) {
	selecting = ((e.keyIdentifier == 'Control') || (e.ctrlKey == true));
	if (typedAddress) {
		if (e.keyCode == 68) //d key
			addPanel();
		if (e.keyCode == 46) //delete key
			removePanel();
		if (e.keyCode == 81) //q key
			rotatePanel(-1, false); //rotate panel 1 degree leftwards
		if (e.keyCode == 69) //e key 
			rotatePanel(1, false); //rotate panel 1 degree rightwards
		if (e.keyCode == 65) //a key 
			auto_map_panel();
	}
}

function notSelecting(){
	selecting = false;
}



/* SHORTKEYS */

/*
 * This function makes hitting the enter key do the exact same as clicking the
 * submit button on the geocoder. Shortcode for submit button.
 */
function submitKeyPress(e) {
	// look for window.event in case event isn't passed in
	e = e || window.event;
	if (e.keyCode == 13) {
		document.getElementById("submit").click();
		return false;
	}
	return true;
}

function addpanelarray(poly){
	
	var path = poly.getPath();
	var tl = path.getAt(0); //top left point
	var tr = path.getAt(1); //top right point 
	//var bl = path.getAt(2); //btm left point 
	var sphere = google.maps.geometry.spherical;
	var distances = []; //to contain distances
		for (d=1; d<path.length; d++){
			distances.push(sphere.computeDistanceBetween(path.getAt(d-1),path.getAt(d)));
		};
	console.log("L of path is ",path.length);
	
	if(path.length == 3){
		isATriangle = true;
		console.log("shit");
		var bottom = distances[0];
		toplength = bottom;
		var maxnumpanels = Math.floor(bottom/panelwidth);
		var mid_bottom = sphere.interpolate(tl,tr,0.5); //LatLng of midpoint
		console.log("mid_bottom is ",mid_bottom.lat()); 
		var sphere = google.maps.geometry.spherical;
		var dist_top2btm = sphere.computeDistanceBetween(path.getAt(2),mid_bottom);
		sidelength = dist_top2btm;
		var numrows = Math.floor(dist_top2btm/panellength);
		for(toplength = 1; toplength<maxnumpanels+1;toplength++){
			addPanel();
		};
	}
	else if(path.length ==4){
		isARectangle = true;
		var topl = distances[0]; // dist btwen tl and and tr
		var sidel = distances[1]; //dist btwn tl and br
		var topangle = sphere.computeHeading(tl,tr) - 90.0;
		
		if (topangle < 0){
			topangle = topangle + 360;
		}
		
		console.log("the angle btwn tr and tl is ", topangle);
		var num_panels = Math.ceil((topl/panelwidth) / 100000) + 2;
		toplength  = num_panels; 
		var sl = Math.floor(Math.floor(sidel/panellength) / 100000) - 1;
		sidelength = sl;
		for (var c= 0; c < num_panels*sl; c++) {
			addPanel();
			console.log("A panel was added")
		};
		selectAll(); //select all panels for rotation purposes
		rotatePanel(topangle, false); //
	}
	else{
		console.log("bruh what the hell is bigger than 4 tho");
	};
}
//function Cartesian(x,y,z) {
//      this.X = x;
//      this.Y = y;
//      this.Z = z;
//}
//
//function LatLngToCartesian(latlong) {
//    var lat = rad(latlong.lat());
//    var lon = rad(latlong.lng());
//    var x = earthRadius * Math.cos(lat)*Math.cos(lon);
//    var y = earthRadius * Math.cos(lat)*Math.sin(lon);
//    var z = earthRadius * Math.sin(lat);
//    return new Cartesian(x,y,z);
//}
//
//function CartesianToLatLng(cartesian) {
//    var r = Math.sqrt(cartesian.X* cartesian.X + cartesian.Y* cartesian.Y+ cartesian.Z* cartesian.Z); 
//    var lat = deg(Math.asin(cartesian.Z/r));
//    var lon = deg(Math.atan2(cartesian.Y, cartesian.X));
//    return new VELatLong(lat,lon);
//}

/*
Implentation of the Haversine function 
input: [lat1, lng1] and [lat2, lng2]
output: distance d between [lat1, lng1] and [lat2, lng2] in meters   
*/
var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};
var rad = function(x) {
	return x * Math.PI / 180;
};

var deg = function(x) {
	return x * 180 / Math.PI;
};

//google.maps.event.addDomListener(window, 'load', init);
	//google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon){auto_map_panel();});
function EuclideanDistBtwnPoints(p1, p2){
	return Math.sqrt(Math.pow(p2.y - p1.y,2)+ Math.pow(p2.x - p1.x,2));
};
	
function auto_map_panel () {
	offset = 0.00005;
	var isClosed = false; //bool that says whether polygon is closed
	var poly = new google.maps.Polyline({ map: map, path: [], strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 2 }); //empty MVC array for polygon 
	//var proppoly = new google.maps.Polyline({ map: map, path: [], strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 2 });
	google.maps.event.addListener(map, 'click', function (clickEvent){
	if (isClosed) //break if polygon is complete 
			return;
		var markerIndex = poly.getPath().length; //marker index as a function of current polygon length 
		var isFirstMarker = markerIndex === 0;
		var marker = new google.maps.Marker({ map: map, position: clickEvent.latLng, draggable: true });
		if (isFirstMarker) {
			google.maps.event.addListener(marker, 'click', function () {
				if (isClosed)
					return;
				var path = poly.getPath();
				//poly.setMap(null);
				poly = new google.maps.Polygon({ map: map, path: path, strokeColor: "#FF0000", strokeWeight: 2});
				isClosed = true;
				console.log("closed");
				poly.setMap(map);
				var proppoly = prop_poly(poly);
				//innerPoly.zIndex = 99999.0;
				proppoly.setMap(map);
				//proppoly.setMap(null);
				modifyInitPoints(proppoly);
				
				//addPanel();
				//console.log("A panel was added");
				
				addpanelarray(proppoly);
			});
		}
		
		google.maps.event.addListener(marker, 'drag', function (dragEvent) {
			//proppoly.setMap(null);
			poly.getPath().setAt(markerIndex, dragEvent.latLng);
		});
		
		poly.getPath().push(clickEvent.latLng);
	});	
};


function proportion(sphere,center,p, scale_factor){
var dist = sphere.computeDistanceBetween (p,center) * scale_factor;
//console.log("The dist btwn p and center is ", dist);
var heading = sphere.computeHeading(center,p);
//console.log("The heading from the center to ",p.lat(),",",p.lng(), " relative to N is ", heading);
var newpt = sphere.computeOffset(center, dist, heading);
//console.log("In proportion(),the newpt has been calc.");
console.log("-----------------");
return newpt
};

function polygonCenter(poly) {
    var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = [],
        vertices = poly.getPath();

    for(var i=0; i<vertices.length; i++) {
      lngs.push(vertices.getAt(i).lng());
      lats.push(vertices.getAt(i).lat());
    }

    lats.sort();
    lngs.sort();
    lowx = lats[0];
    highx = lats[vertices.length - 1];
    lowy = lngs[0];
    highy = lngs[vertices.length - 1];
    center_x = lowx + ((highx-lowx) / 2);
    center_y = lowy + ((highy - lowy) / 2);
    return (new google.maps.LatLng(center_x, center_y));
  }


function prop_poly(poly) {
	var center = polygonCenter(poly);
	console.log("Center of bounding rectangle is " ,center.lat(), "and", center.lng());
	
	/*
	var center = new google.maps.Marker({
		position : c,
		map : map
	});
	*/
	//center.setMap(map);
	//check
	
	/////////////extract latLngs of test_poly
	var vertices = poly.getPath();
	var sphere = google.maps.geometry.spherical;
	//console.log(vertices.getAt(1).lng());
	var newLatLngs = []; // List of LatLngs
	var scale_factor = 0.85;
	
    for(var i=0; i<vertices.length; i++) {
		var vertex = vertices.getAt(i);
		newLatLngs.push(proportion(sphere, center, vertex, scale_factor));
    };
	
	//datatype_debugger(newLatLngs[1]);
	
	var newLatLngsPath = new google.maps.MVCArray();
	
	for(var i=0; i<vertices.length; i++){
		newLatLngsPath.push(newLatLngs.pop(i));
	};
	
	
	var prop_poly =  new google.maps.Polygon({
		paths: newLatLngsPath,
		strokeColor: '#0000FF',
		strokeOpacity: 0.8,
		strokeWeight: 2
	});
	
	//var show = true;
	
	//if (show == true)
	return prop_poly;
	
	/////////////////
}

function popupbox(map){
	var contentString = '<div>' + 
							'<div>' + 
								'<h1> How to use the AutoMap Feature: </h1> </div>' +
									'<p> To use the AutoMap feature, first click the AutoMap button.' +
									'Once you have done this, click the edge of the roof on which you would like to add solar panels '+
									'and a red marker will appear. Place these markers in such a way as to fully outline your roof '+
									'until you reach the initial marker, which you will click on to close your outline.' +
									'Once you have done this, the AutoMap feature will do the rest. </p>' +
						'</div>'

	var infowindow = new google.maps.InfoWindow({
	content: contentString
	});
	
	var infowindowlocation = map.getCenter();
	console.log(infowindowlocation.lat());
	
	infowindow.open(map, infowindowlocation);
}


function modifyInitPoints(poly){
	
	var path = poly.getPath();
	var topLeftOfPanel = path.getAt(0);
	var topLeftOfPanelLat = topLeftOfPanel.lat();
	var topLeftOfPanelLng = topLeftOfPanel.lng();
	
	latPoints.northwest = latPoints.northeast = topLeftOfPanelLat;
	latPoints.southeast = latPoints.southwest = topLeftOfPanelLat - 0.0000149;
	lngPoints.northwest = lngPoints.southwest = topLeftOfPanelLng;
	lngPoints.southeast = lngPoints.northeast = topLeftOfPanelLng + 0.000011;
}
//google.maps.event.addDomListener(window, 'load', init);