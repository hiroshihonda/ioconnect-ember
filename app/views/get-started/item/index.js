import Ember from 'ember';

export default Ember.View.extend({

  layoutName: 'get-started/item/layout',
  
  NewGoogleMap: Ember.View.extend({
	  templateName: 'get-started/item/partials/address-map-new',
	  
	  didInsertElement() {
		  setTimeout(()=>{
			  initMap()
			  
			  let address = this.get('controller.model.address')
			  
			  if(address && address != 'none')
				  google.maps.event.addListenerOnce(map, 'idle', ()=>{
						let service = new google.maps.places.AutocompleteService()
						service.getPlacePredictions({input:address,
							types:[]},(pred,status) => {
								if(status == google.maps.places.PlacesServiceStatus.OK && 
									pred && pred.length > 0)
								{
									let pservice = new google.maps.places.PlacesService(map)
									pservice.getDetails({placeId:pred[0].place_id}, (p,s)=>{
										if(s == google.maps.places.PlacesServiceStatus.OK)
										{
											placeChanged(p)
										}
									})
								}
							})
				  });
		  },100)
	  }
	 
  }),

  GoogleMap: Ember.View.extend({
    addressElId: 'google-address',
    templateName: 'get-started/item/partials/address-map',

    map: null,

    _triggerEnterOnAddress: function() {
      var e = jQuery.Event('keypress');
      e.which = 13;
      e.keyCode = 13;
      $(this.get('addressElId')).trigger(e);
    },

    didInsertElement: function() {
      var canvas = document.getElementById('map-canvas');
      var addrId = this.get('addressElId');
      var markers = [];
      var map = new google.maps.Map(canvas, {
        mapTypeId: google.maps.MapTypeId.HYBRID,
        center: new google.maps.LatLng(39.5, -98.35),
        mapTypeControl: false,
        zoom: 4
      });
      var _this = this;

      // Create the search box and link it to the UI element.
      var input = /** @type {HTMLInputElement} */(
        document.getElementById(addrId));

      var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(input));

      // Listen for the event fired when the user selects an item from the
      // pick list. Retrieve the matching places for that item.
      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
          marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });

          markers.push(marker);

          bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
      });

      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        address: $('#' + addrId).val()
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          // Create a marker for each place.
          var marker = new google.maps.Marker({
            map: map,
            title: results[0].formatted_address,
            position: results[0].geometry.location
          });
          var bounds = new google.maps.LatLngBounds();

          markers.push(marker);
          map.fitBounds(bounds.extend(results[0].geometry.location));
        }
      });

      // Bias the SearchBox results towards places that are within the bounds of the
      // current map's viewport.
      google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
      });

      google.maps.event.addListenerOnce(map, 'idle', function(){
        _this._triggerEnterOnAddress();
      });

    }
  })
});
