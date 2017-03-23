import Ember from 'ember';
import {values, callPVWatts} from '../../../models/proposal/pvwatt';
import months from '../../../utils/months';
import {types, typeValues} from '../../../models/market-profile/tax';
import config from '../../../config/environment';

export default Ember.Controller.extend({
	
  next: true,
  prev: true,

  usePvwatts: true,

  incentiveTypes: typeValues,

  selectedMarketProfile: null,
  currentSlideName: "lookup",
  proposal: undefined,

  saveProposalPromise: undefined,
  sendToCRMPromise: undefined,

  pvWattsResult: Ember.Object.create({
    errors: [],
    success: false,
    incomplete: false
  }),

  /**
   * Get the full path to a slide
   * @param name
   * @returns {string}
   */
  getSlideByName: function (name) {
    return "get-started/item/partials/" + name;
  },

  /**
   * Generates full name of the current slide
   * @returns {string}
   */
  currentSlide: function () {
    return this.getSlideByName(this.get('currentSlideName'));
  }.property('currentSlideName'),

  _createIncentive: function (profile, name) {
    var defaultTaxOptions = {
      type: types.PERCENT,
      value: 0
    };

    if (profile.get('solarItem.' + name)) {
      defaultTaxOptions = profile.get('solarItem.' + name);
    }

    return this.store.createRecord('proposal/incentive', defaultTaxOptions);
  },

  /**
   *
   */
  initProposalItems: function () {
    var items = this.get('selectedMarketProfile.items'),
      proposalItems = this.get('proposal.items'),
      store = this.store,
      proposal = this.get('proposal'),
      profile = this.get('selectedMarketProfile'),
      _this = this;

    if (!profile) {
      return false;
    }

    this.set('proposal.inflationRate', profile.get('inflationRate') || 0);
    this.set('proposal.connectionFee', profile.get('connectionFee') || 10);
    this.set('proposal.defaultSolarPrice', profile.get('defaultSolarPrice') || 0);
    this.set('proposal.design.pricePerWatt', proposal.get('defaultSolarPrice'));
	
	this.set('proposal.marketProfile', profile);

    proposalItems.clear();


    var solarProduct = this.store.createRecord('proposal/product', {
      name: 'Solar',
      price: 0,
      productPricing: "PPW",
      savingsCalculation: "KWH"
    });

    var solarMarketItem = this.store.createRecord('proposal/market-item', {
      product: solarProduct,
      federal: _this._createIncentive(profile, 'federal'),
      utility: _this._createIncentive(profile, 'utility'),
      rebates: _this._createIncentive(profile, 'rebates'),
      state: _this._createIncentive(profile, 'state'),
      tax: _this._createIncentive(profile, 'tax')
    });

    var solarItem = store.createRecord('proposal/solar-item', {
      marketItem: solarMarketItem,
      kwh: store.createRecord('product/kwh', {
        kwhUsage: 0
      }),
      calculation: store.createRecord('product/calculation'),
      percent: store.createRecord('product/percent'),
      parentProposal: _this.get('proposal')
    });
    this.set('proposal.solarItem', solarItem);

    items.forEach(function (item, index) {
      var product = store.createRecord('proposal/product', item.get('product').serialize({
        includeId: false
      }));

      var cloneItem = item.toJSON({
        includeId: false
      });

      cloneItem.product = product;

      cloneItem.federal = store.createRecord('proposal/incentive', item.get('federal').serialize({
        includeId: false
      }));
      cloneItem.state = store.createRecord('proposal/incentive', item.get('state').serialize({
        includeId: false
      }));
      cloneItem.utility = store.createRecord('proposal/incentive', item.get('utility').serialize({
        includeId: false
      }));
      cloneItem.tax = store.createRecord('proposal/incentive', item.get('tax').serialize({
        includeId: false
      }));
      cloneItem.rebates = store.createRecord('proposal/incentive', item.get('rebates').serialize({
        includeId: false
      }));

      var marketItem = store.createRecord('proposal/market-item', cloneItem);

      var newItem = store.createRecord('proposal/item', {
        marketItem: marketItem,
        parentProposal: proposal
      });

      newItem.set('calculation', store.createRecord('product/calculation'));
      newItem.set('percent', store.createRecord('product/percent'));
      newItem.set('kwh', store.createRecord('product/kwh'));
      proposalItems.addObject(newItem);
    });

  }.observes('selectedMarketProfile'),


  onPotentialUsageChange: function () {
    this.fillUtilityData();
  }.observes('model.averageBill', 'model.annualUsage', 'model.utilityUsage.usageCalendar', 'model.utilityUsage.billCalendar'),

  fillUtilityData: function () {
    var avgBill = this.model.get('averageBill'),
      annualUsage = parseFloat(this.model.get('annualUsage')),
      usageCalendar = this.get('model.utilityUsage.usageCalendar'),
      billCalendar = this.get('model.utilityUsage.billCalendar'),
      monthBill = 0;

    if (avgBill && billCalendar) {
      months.shortCodes.forEach(function (month) {
        billCalendar.set(month, avgBill);
      });
    }

    if (annualUsage && usageCalendar) {
      monthBill = Math.ceil(annualUsage / 12);

      months.shortCodes.forEach(function (month) {
        usageCalendar.set(month, monthBill);
      });
    }
  },

  /**
   * Performs call to PVWatts
   */
  loadPVWatts: function () {
    var pvwatts = this.get('proposal.pvwatts'),
      address = this.get('model.address'),
      self = this;

    if (!pvwatts || this.get('proposal.id')) return false;

    this.set('pvWattsResult.incomplete', false);
    this.set('pvWattsResult.success', false);

	let promises = [];
	pvwatts.forEach((pvwatts) => {
    var promise = callPVWatts({
      system_capacity: pvwatts.get('system_capacity'),
      module_type: pvwatts.get('module_type'),
      array_type: pvwatts.get('array_type'),
      losses: pvwatts.get('losses'),
      tilt: pvwatts.get('tilt'),
      azimuth: pvwatts.get('azimuth'),
      dc_ac_ratio: pvwatts.get('dc_ac_ratio'),
      inv_eff: pvwatts.get('inv_eff'),
      gcr: pvwatts.get('gcr'),
      address: address
    });
	
	if(promise !== null)
		promises.push(promise);
	});

    if (promises.length != pvwatts.get('length')) {
      this.set('pvWattsResult.incomplete', true);
      return false;
    }

    Promise.all(promises).then(function (data) {
      let out = data[0]['outputs'];
	  
	  for(let i = 1; i < data.length; ++i)
	  {
		  for(let k in out) 
			  if(typeof out[k] == 'object')
				  for (let j in out[k])
					  out[k][j] += data[i]['outputs'][k][j];
				else
					out[k] += data[i]['outputs'][k];
	  }
	  
	  
	  pvwatts.forEach((pvwatts)=> {
		  for (let k in out) {
			pvwatts.set(k, out[k]);
		  }
	  })
      self.set('pvWattsResult.errors', []);
      self.set('pvWattsResult.success', true);
      self.set('pvWattsResult.incomplete', false);
    }, function (data) {
      var errors = data.responseJSON && data.responseJSON.errors || [];
      self.set('pvWattsResult.errors', errors);
    });

  },
  
  _loadPVWattsObserver:function() {
	  Ember.run.debounce(this, this.loadPVWatts, 500);
  }.observes('proposal.pvwatts.@each.system_capacity',
    'proposal.pvwatts.module_type', 'proposal.pvwatts.array_type',
    'proposal.pvwatts.losses', 'proposal.pvwatts.@each.tilt', 'proposal.pvwatts.@each.azimuth',
    'proposal.pvwatts.dc_ac_ratio', 'proposal.pvwatts.inv_eff', 'proposal.pvwatts.gcr',
    'model.address'
  ),

  actions: {

    setSlide: function (slideName) {
      this.set('currentSlideName', slideName);
    },

    addTier: function() {
      this.get('proposal.tiers').addObject(this.store.createRecord('proposal/tier'));
    },

    removeTier: function(tier) {
      tier.deleteRecord();
    },

    selectLoanOption: function (loan) {
      this.get('proposal.loanOptions').forEach(function (l) {
        l.set('selected', false);
      });
      loan.set('selected', true);
    },

    savePotentialToApi: function (data) {
      var potential = data.potential;

      potential.save();
    },

    saveProposal: function () {
      var proposal = this.get('proposal'),
        self = this;
		
		  let method = 'POST',
			url = config.apiHost + '/api/1.0/proposals';
    	if(this.container.lookup('controller:application').currentPathName()=='get-started.edit-proposal')
    	{
    		method = 'PUT';
    		url += '/'+proposal.get('id');
    	}

      var promise = Ember.$.ajax({
        type: method,
        url: url,
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({
          proposal: proposal.serialize()
        })
      });

      this.set('saveProposalPromise', promise);

      promise.then(function (result) {
        self.transitionToRoute('proposal.view-potential.view-proposal', proposal.get('potential.id'), result.proposal.id);
        // proposal.deleteRecord();
      }.bind(this));
    },

    sendToCRM: function () {
      var potential = this.get('proposal.potential');

      var promise = Ember.$.ajax({
        type: "POST",
        url: config.apiHost + "/dev/updatePotential",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
          potential: potential.serialize({
            includeId: true
          })
        })
      });

      this.set('sendToCRMPromise', promise);

      promise.then(function (resp) {
      }, function (xhr) {
      });
    },
	
	takeScreenshot() {
		NProgress.start();
    $(".mapLayout").addClass("disabledbutton");
		let staticMapUrl = 'http://maps.googleapis.com/maps/api/staticmap?';
		staticMapUrl += 'center='+mapPlace.geometry.location.lat()+','+mapPlace.geometry.location.lng();
		staticMapUrl += '&zoom='+mapZoom;
		staticMapUrl += '&size=600x700';
		staticMapUrl += '&maptype=satellite';
		
		let panelPaths = []
		
		for(let i in panel)
		{
			let p = panel[i]
			
			if(p && p.getPaths)
			{
				let panelPath = {azimuth:p.azimuth, tilt:p.tilt, angle:p.azimuth, paths:[]}
				
				staticMapUrl += '&path=color:0xffffff|fillcolor:0x000033aa|weight:1|enc:';
				//|azimuth:'+p.azimuth+'|tilt:'+p.tilt;
				let points = new google.maps.MVCArray();
				
				p.getPaths().forEach((path, i)=>
				{
					
					
					path.forEach(
						(latLng,j)=> {points.push(latLng),
						panelPath.paths.push({lat:latLng.lat(), lng: latLng.lng()})})
						
					
				})
				
				staticMapUrl += google.maps.geometry.encoding.encodePath(points)
				
				panelPaths.push(panelPath)
			}
		}
		
		let session = this.container.lookup('simple-auth-session:main'),
			data = session.get('store').restore().secure.auth || {};
		
		let ourUrl = `http://${window.location.hostname}:${window.location.port}/#/get-started/potential/${this.get('proposal.potential.id')}?addressMap=${encodeURIComponent(this.get('proposal.potential.address'))}&email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`
		
		let url = `http://${window.location.hostname}:8889/?url=${encodeURIComponent(ourUrl)}`
		
		this.set('proposal.panelLayoutFile.available', false);
		Ember.$.ajax({
			method: 'POST',
			url: config.apiHost+'/api/files/uploadFromUrl',
			data: {
				name: this.get('proposal.panelLayoutFile.name'),
				url: btoa(url),
				postData: JSON.stringify(panelPaths)
			}
		}).then(e => {
			NProgress.set(0.8)
			this.set('proposal.panelLayoutFileUrlRand', new Date().getTime())
			this.set('proposal.panelLayoutFile.available', true);
			
			Ember.run.later(this, ()=>NProgress.done(), $(".mapLayout").removeClass("disabledbutton"), 200)
		})
	}
  }
});
