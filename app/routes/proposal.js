import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  // controllerName: 'potential',

  setupController: function(controller, potentials){
    controller.set('potentials', potentials);
  },

  model: function(){
    return this.store.find('potential');
  },
  
  actions: {
	  cloneProposal(id) {
		  console.log('cloneProposal '+id)
		  
		  let proposal = this.store.find('proposal', id)
		  .then((proposal) => {
			  let newProp = proposal.serialize ({
					  includeId:false
			  })
			  
			  newProp.potential = proposal.get('potential')
			  
			  let name = proposal.get('name')
			  let matches = name.match(/^(.*?)\s+\((\d+)\)$/)
			  
			  let count = 2
			  if(matches && matches.length==3)
			  {
				  count = parseInt(matches[2])+1
				  name = matches[1];
			  }
			  
			  name += ' ('+count+')';
			  newProp.name = name
			  
			  newProp.marketProfile=proposal.get('marketProfile')
			  
			  // newProp.solarItem = proposal.get('solarItem')
			  delete newProp.solarItem
			  // newProp.pvwatts = proposal.get('pvwatts')
			  delete newProp.pvwatts
			  delete newProp.loanOptions
			  // newProp.loanOptions = proposal.get('loanOptions')
			  // newProp.tiers = proposal.get('tiers')
			  delete newProp.tiers
			  delete newProp.items
			  let newProposal = this.store.createRecord('proposal', newProp)
		  
				// newProposal.set('solarItem', proposal.get('solarItem').serialize({includeId:false}))
				
				newProposal.get('loanOptions').clear()
				proposal.get('loanOptions').forEach((option)=> {
					let op = option.serialize({includeId:false})
					op.parentProposal = newProposal
					newProposal.get('loanOptions').addObject(this.store.createRecord('proposal/loan', op))
				})
				
				newProposal.get('pvwatts').clear()
				proposal.get('pvwatts').forEach((pvwatts)=> {
					newProposal.get('pvwatts').addObject(this.store.createRecord('proposal/pvwatt', pvwatts.serialize({includeId:false})))
				})
				
				
				
				newProposal.get('tiers').clear()
				proposal.get('tiers').forEach((tier)=>{
					let t = tier.serialize({includeId:false})
					t.parentProposal = newProposal
					newProposal.get('tiers').addObject(this.store.createRecord('proposal/tier', t))
				})
				
				let solarProductItem = proposal.get('solarItem.marketItem.product')
				if(solarProductItem)
					solarProductItem = solarProductItem.serialize({includeId:false})
				else
					solarProductItem = {}
				var solarProduct = this.store.createRecord('proposal/product', solarProductItem);

		    var solarMarketItem = this.store.createRecord('proposal/market-item', {
		      product: solarProduct,
		      federal: this.store.createRecord('proposal/incentive', proposal.get('solarItem.marketItem.federal')?proposal.get('solarItem.marketItem.federal').serialize({includeId:false}):{}),
		      utility: this.store.createRecord('proposal/incentive', proposal.get('solarItem.marketItem.utility')?proposal.get('solarItem.marketItem.utility').serialize({includeId:false}):{}),
		      rebates: this.store.createRecord('proposal/incentive', proposal.get('solarItem.marketItem.rebates')?proposal.get('solarItem.marketItem.rebates').serialize({includeId:false}):{}),
		      state: this.store.createRecord('proposal/incentive', proposal.get('solarItem.marketItem.state')?proposal.get('solarItem.marketItem.state').serialize({includeId:false}):{}),
		      tax: this.store.createRecord('proposal/incentive', proposal.get('solarItem.marketItem.tax')?proposal.get('solarItem.marketItem.tax').serialize({includeId:false}):{})
		    });

				let c = proposal.get('solarItem.calculation')
				c = c?c.serialize({includeId:false}):{}
				delete c.parentItem
				c = this.store.createRecord('product/calculation', c)
				// delete i.calculation
				
				let k = proposal.get('solarItem.kwh')
				k=k?k.serialize({includeId:false}):{}
				delete k.parentItem
				k = this.store.createRecord('product/kwh', k)
				// delete i.kwh
				
				let p = proposal.get('solarItem.percent')
				p = p?p.serialize({includeId:false}):{}
				delete p.parentItem
				p = this.store.createRecord('product/percent',p)

		    var solarItem = this.store.createRecord('proposal/solar-item', {
		      marketItem: solarMarketItem,
		      kwh: k,
		      calculation: c,
		      percent: p,
		      parentProposal: newProposal
		    });
		    
    newProposal.set('solarItem', solarItem);
				
				newProposal.get('items').clear()
				
				proposal.get('items').forEach((item)=>{
					let i = item.serialize({includeId:false})
					i.marketItem=this.store.createRecord('proposal/marketItem')
					i.marketItem.set('product', this.store.createRecord('proposal/product',
						item.get('marketItem.product').serialize( {includeId:false})))
						
					i.marketItem.set('federal', this.store.createRecord('proposal/incentive',
						item.get('marketItem.federal').serialize( {includeId:false})))
					i.marketItem.set('state', this.store.createRecord('proposal/incentive',
						item.get('marketItem.state').serialize( {includeId:false})))
					i.marketItem.set('utility', this.store.createRecord('proposal/incentive',
						item.get('marketItem.utility').serialize( {includeId:false})))
					i.marketItem.set('tax', this.store.createRecord('proposal/incentive',
						item.get('marketItem.tax').serialize( {includeId:false})))
					i.marketItem.set('rebates', this.store.createRecord('proposal/incentive',
						item.get('marketItem.rebates').serialize( {includeId:false})))
					
					delete i.parentProposal
					
					let c = item.get('calculation').serialize({includeId:false})
					delete c.parentItem
					i.calculation = this.store.createRecord('product/calculation', c)
					// delete i.calculation
					
					let k = item.get('kwh').serialize({includeId:false})
					delete k.parentItem
					i.kwh = this.store.createRecord('product/kwh', k)
					// delete i.kwh
					
					let p = item.get('percent').serialize({includeId:false})
					delete p.parentItem
					i.percent = this.store.createRecord('product/percent',p)
					// delete i.percent
					
					newProposal.get('items').addObject(this.store.createRecord('proposal/item', i))
				})
				
				newProposal.save().then((proposal)=> {
					console.log('new proposal id '+proposal.get('id'))
					
					// window.location.href = window.location.protocol+'//'+window.location.host+'/'+this.container.lookup('router:main').generate('get-started.edit-proposal', proposal.get('id'))
					this.transitionTo('get-started.edit-proposal', proposal.get('id'))
				})
		  })
	  },
	  
	  acceptProposal(id) {
		  this.store.find('proposal',id)
			.then((proposal)=> {
				
				proposal.set('accepted', true)
				
				
				let method = 'PUT',
				url = config.apiHost + '/api/1.0/proposals/'+proposal.get('id');
				

				  Ember.$.ajax({
					method: method,
					url: url,
					dataType:'json',
					contentType: 'application/json;charset=UTF-8',
					data: JSON.stringify({
					  proposal: proposal.serialize()
					})
				  });
				
			})
	  }
  }
});
