import DS from 'ember-data';
import months from '../utils/months';
import {productPricing} from './product';
import {types} from './market-profile/tax';
import config from '../config/environment';
import files from '../utils/files';

var priceKwh = config.calc.priceKwh;
var kwhTax = config.calc.kwhTax;

export default DS.Model.extend({
  sample: DS.attr('string'),
  potential: DS.belongsTo('potential'),
  energy: DS.attr(),
  design: DS.attr(),
  name: DS.attr(),
  inflationRate: DS.attr(),
  connectionFee: DS.attr(),
  defaultSolarPrice: DS.attr(),
  created: DS.attr(),
  panelLayoutFileName: DS.attr(),
  accepted: DS.attr(),
  
  marketProfile: DS.belongsTo('market-profile/profile'),

  solarItem: DS.belongsTo('proposal/solar-item', {
    inverse: 'parentProposal',
    async: true
  }),

  items: DS.hasMany('proposal/item', {
    inverse: 'parentProposal',
    async: true
  }),

  loanOptions: DS.hasMany('proposal/loan', {
    inverse: 'parentProposal',
    async: true
  }),
  
  attachments: DS.attr(),
  
  fileAttachments: function() {
	  
	  let defaultCategories = ['Contract','Financing Docs', 'Utility Bill','Utility Docs','HOA'];
	  
	  let attachments = this.get('attachments')
	  
	  let actualAttachments = []
	  let categoriesFound = {}
	  attachments.forEach((att)=>{
		  actualAttachments.push(this.store.createRecord('proposal/attachment',att))
		  categoriesFound[att.category] = 1
	  })
	  
	  for (let cat of defaultCategories)
	  {
		  if(!categoriesFound[cat])
		  {
			  actualAttachments.push(this.store.createRecord('proposal/attachment', {
				  category:cat,
				  fileName:''
			  }))
		  }
	  }
	  
	  return actualAttachments
	  
  }.property(),
  
  saving:false,
  
  fileAttachmentsChanged: function() {
	  if(this.get('saving'))
		  return
	  
	  if(!this.get('id'))
		  return
	  
	  let fileAttachments = this.get('fileAttachments')
	  let anyAvailable = fileAttachments.some((att)=>att.get('fileAvailable'))
	  
	  if(anyAvailable)
	  {
		  this.set('saving', true)
		  let attachments = this.get('attachments')
		  // let newAttach = []
		  // fileAttachments.forEach((att) => {if(att.get('fileAvailable')) newAttach.push(this.store.createRecord('proposal/attachment',att.serialize()))})
		  attachments.replace(0,attachments.get('length'), fileAttachments)
		  
		  this.save()
		  this.set('saving', false)
	  }
	  
  }.observes('fileAttachments.@each.fileAvailable'),

  pvwatts: DS.hasMany('proposal/pvwatt'),
  
  systemCapacity: function() {
	  var w = this.get('pvwatts').reduce((prev, pvwatts)=>parseFloat(prev)+parseFloat(pvwatts.get('system_capacity')),0);

	return isNaN(w) ? 0 : w;
  }.property('pvwatts.@each.system_capacity'),
  
  systemCapacityKw: function () {
    var w = this.get('pvwatts').reduce((prev, pvwatts)=>parseFloat(prev)+parseFloat(pvwatts.get('system_capacity')),0);

    return isNaN(w) ? 0 : w * 1000;
  }.property('pvwatts.@each.system_capacity'),
  
  ac_annual: function () {
    var w = this.get('pvwatts.firstObject.ac_annual');

    return isNaN(w) ? 0 : w;
  }.property('pvwatts.@each.ac_annual'),

  ratePerPeriod: DS.attr(),
  numberOfPeriods: DS.attr(),
  downPayment: DS.attr(),

  // By default Average cost of Electricity
  // Possible options: average, avoided
  savingsCalculationType: DS.attr(),
  tiers: DS.hasMany('proposal/tier', {
    inverse: 'parentProposal'
  }),

  /**
   * Get the selected loan options
   * If no loan selected, return the first available
   */
  selectedLoanOption: function () {
    return this.get('loanOptions').findBy('selected', true);
  }.property('loanOptions.@each.selected'),

  tiersTotalPercentage: function () {
    var tiers = this.get('tiers'),
      sum = 0;

    tiers.forEach(function (tier) {
      sum += (parseFloat(tier.get('percentage')) || 0);
    });

    return sum;
  }.property('tiers', 'tiers.@each.percentage'),

  calendar: function () {
    return months.shortCodes;
  }.property(),
  
  panelLayoutFileAvailable:false,

  panelLayoutFile: function () {
    var name = this.get('panelLayoutFileName'),
      available = this.get('id') && name && this.get('panelLayoutFileAvailable');
	  
	  if(!available && this.get('id') && name)
	  {
		  Ember.run.next(()=> {
			  Ember.$.ajax({
				url: files.model.create({name:name,available:true}).get('url'),
				type: 'GET'
			  }).then(() => {
				this.set('panelLayoutFileAvailable', true);
			  });
		  })
	  }

    var model = files.model.create({
      name: name,
      available: available
    });

    return model;
  }.property('panelLayoutFileName','panelLayoutFileAvailable'),
  
  panelLayoutFileUrlRand:'',
  
  panelLayoutFileUrl: function() {
	  return this.get('panelLayoutFile.url')+
		(this.get('panelLayoutFileUrlRand') ? `&rand=${this.get('panelLayoutFileUrlRand')}`:'')
  }.property('paneLayoutFile.url','panelLayoutFileUrlRand'),

  colorItems: function () {
    var colors = [
        [126, 182, 247],
        [89, 148, 217],
        [68, 116, 171],
        [64, 127, 250]
      ],
      items = this.get('items'),
      i = 0;
    items.forEach(function (item, index) {
      item.set('rgbColor', colors[index] || []);
    });
  }.observes('items'),

  createdDate: function () {
    return this.get('created') || (new Date());
  }.property('created'),

  proposalName: function () {
    return this.get('name') || 'New Proposal';
  }.property('name'),

  /**
   * Return selected items for this proposal
   */
  selectedItems: function () {
    return this.get('items').filterBy('selected', true);
  }.property('items.@each.selected'),

  billableItems: function () {
    var selectedItems = this.get('selectedItems'),
      solarItem = this.get('solarItem'),
      a = [];

    a.addObjects(selectedItems);
    a.addObject(solarItem);
    return a;
  }.property('solarItem', 'selectedItems'),

  incentives25Years: function () {
    var incentives = [],
      inc = this.get('totalIncentives');

    incentives.push(0);

    incentives = incentives.concat(this._inflationOverYears(inc, 25));
	return incentives.map(function(item, idx){if(idx==1)return item; return 0;})
  }.property('incentives'),

  paybackYears: function () {
    var cumulative = this.get('cumulativeSavings25Years'),
      years = 0;

    cumulative.forEach(function (item) {
      if (item < 0) {
        years++;
      }
    });

    return years;
  }.property('cumulativeSavings25Years'),

  cumulativeSavings25Years: function () {
    var savings = [],
      annual = this.get('annualSavings25Years'),
      prev = 0;

    annual.forEach(function (val, i) {
      prev += val;
      savings.push(prev);
    });

    return savings;
  }.property('annualSavings25Years'),

  annualSavings25Years: function () {
    var savings = [],
      billWith = this.get('bill25YearsWithItems'),
      billWithout = this.get('bill25YearsWithoutItems');

    billWithout.forEach(function (val, i) {
      savings.push(val - billWith[i]);
    });

    return savings;
  }.property('bill25YearsWithoutItems', 'bill25YearsWithItems'),

  bill25YearsWithItems: function () {
    var netPrice = this.get('netPrice'),
      billAfter = this.get('billAfterEfficiency'),
      bills = [];

	  if(this.get('selectedLoanOption.term') > 0)
		  bills.push(this.get('selectedLoanOption.financing') + billAfter)
	  else
		bills.push(netPrice + billAfter);

    return bills.concat(this._inflationOverYears(billAfter, 25));
  }.property('billAfterEfficiency', 'netPrice', 'inflationRate', 'selectedLoanOption.financing'),

  bill25YearsWithoutItems: function () {
    var avg = this.get('potential.utilityUsage.sumElectricityBill'),
      bills = [];

    bills.push(avg);

    return bills.concat(this._inflationOverYears(avg, 25));
  }.property('potential.utilityUsage.billCalendar.changedMonths', 'inflationRate'),

  _inflationOverYears: function (value, years) {
    var y = [],
      prevYear = value,
      inflation = this.get('inflationRate') || 0;

    for (var i = 0; i < years; i++) {
      y.push(prevYear);
      prevYear += prevYear * (inflation / 100);
    }

    return y;
  },

  /**
   * Force to select the first loan option available
   */
  _loanOptionSelection: function () {
    if (this.get('loanOptions.length') && !this.get('selectedLoanOption')) {
      this.get('loanOptions.firstObject').set('selected', true);
    }
  }.observes('loanOptions').on('init'),

  /**
   * Listen for pvwatts and add solar product
   */
  _onSolarItem: function () {
    var solarPrice = this.get('solarPrice'),
      acMonthly = (this.get('ac_annual') || 0) / 12;

    if (this.get('solarItem.marketItem')) {
      this.set('solarItem.kwh.kwhUsage', acMonthly);
      this.set('solarItem.marketItem.product.price', solarPrice);
    }


  }.observes('solarPrice', 'ac_annual').on('init'),

  solarPrice: function () {
    var ppw = this.get('design.pricePerWatt'),
      dcSize = this.get('systemCapacityKw');

    if (ppw && dcSize) {
      return ppw * dcSize;
    }

    return 0;
  }.property('design.pricePerWatt', 'systemCapacityKw'),

  /**
   * Calculate total incentives
   */
  totalIncentives: function () {
    var sum = 0;

    this.get('billableItems').forEach(function (item) {
      sum += item.get('incentives');
    });

    return sum;
  }.property('billableItems.@each.incentives'),

  /**
   * Calculate gross total price
   */
  grossPrice: function () {
    var sum = 0;
    this.get('billableItems').forEach(function (item) {
      sum += parseFloat(item.get('price')) || 0;
    });
    return sum;
  }.property('billableItems', 'billableItems.@each.price'),

  federal: function () {
    return this._calcSum(this.get('billableItems'), 'federalIncentive');
  }.property('billableItems.@each.federalIncentive'),

  state: function () {
    return this._calcSum(this.get('billableItems'), 'stateIncentive')
  }.property('billableItems.@each.stateIncentive'),

  utility: function () {
    return this._calcSum(this.get('billableItems'), 'utilityIncentive');
  }.property('billableItems.@each.utilityIncentive'),

  rebates: function () {
    return this._calcSum(this.get('billableItems'), 'rebatesIncentive');
  }.property('billableItems.@each.rebatesIncentive'),

  tax: function () {
    return this._calcSum(this.get('billableItems'), 'taxIncentive');
  }.property('billableItems.@each.taxIncentive'),

  _calcSum: function (arr, key) {
    var sum = 0;

    arr.forEach(function (item) {
      sum += item.get(key) || 0;
    });

    return sum;
  },

  /**
   * Calculate net total price
   */
  netPrice: function () {
    var sum = 0;
    this.get('billableItems').forEach(function (item) {
      sum += parseFloat(item.get('netCost')) || 0;
    });
    return sum;
  }.property('billableItems', 'billableItems.@each.netCost'),

  netPriceFinanced: function () {
    return this.get('selectedLoanOption.amountFinanced');
  }.property('selectedLoanOption.amountFinanced'),

  /**
   * Calculate net monthly rate including incentives
   */
  netMonthlyRate: function () {
    return this.get('selectedLoanOption.monthlyRate');
  }.property('selectedLoanOption.monthlyRate'),

  monthlyFinalCost: function () {
    var newBill = this.get('monthlyBillAfterEfficiency') || 0,
      monthlyRate = this.get('netMonthlyRate') || 0;

    return newBill + monthlyRate;
  }.property('monthlyBillAfterEfficiency', 'netMonthlyRate'),

  monthlySavings: function () {
    var oldBill = this.get('potential.utilityUsage.averageElectricityBill') || 0,
      finalCost = this.get('monthlyFinalCost') || 0;

    return oldBill - finalCost;

  }.property('potential.utilityUsage.averageElectricityBill', 'monthlyFinalCost',
    'savingsCalculationType', 'avoidedCostOfEnergy', 'ac_annual'
  ),

  monthlyAvoidedCostOfEnergy: function() {
    return this.get('annualAvoidedCostOfEnergy') / 12;
  }.property('annualAvoidedCostOfEnergy'),

  annualAvoidedCostOfEnergy: function () {
    var tiers = this.get('tiers').toArray(),
      i, sum = 0, currentPercentage, currentKwh,
      currentConsumption, currentVal, cost = 0,
      consumption = this.get('potential.utilityUsage.sumUsage'),
      production = this.get('ac_annual');

    this.get('selectedItems').forEach(function(item) {
      production += item.get('savingsCalculation.annualKwhSavings') || 0;
    });

    for (i = tiers.length - 1; i >= 0; i--) {
      currentPercentage = parseFloat(tiers[i].get('percentage')) || 0;
      currentKwh = parseFloat(tiers[i].get('kwhPrice')) || 0;
      currentConsumption = consumption * (currentPercentage / 100);

      sum += currentConsumption;

      if (sum <= production) {
        cost += currentConsumption * currentKwh;
      } else {
        currentVal = production - (sum - currentConsumption);
        if (currentVal < 0) {
          currentVal = 0;
        }
        cost += currentVal * currentKwh;
      }
      console.log('current', sum, production, currentPercentage, currentKwh, currentConsumption, currentVal);
    }

    return cost;
  }.property('tiers.@each.kwhPrice', 'tiers.@each.percentage',
    'ac_annual', 'potential.utilityUsage.sumUsage', 'selectedItems.@each.annualKwhSavings'),

  _calcMonthlyRate: function (price) {
    var r = this.get('ratePerPeriod'),
      n = this.get('numberOfPeriods'),
      down = this.get('downPayment') || 0,
      pv = price - down;

    if (!pv || !n || !r) {
      return 0;
    }

    r = r / 100;

    return (
      (r / 12 * pv) /
      (1 - Math.pow(1 + r / 12, 0 - n))
    );

  }
  ,

  billAfterEfficiency: function () {
    var monthly = this.get('monthlyBillAfterEfficiency') || 0;

    return monthly * 12;
  }
    .
    property('monthlyBillAfterEfficiency'),

  /**
   * Calculate the new monthly electric bill after
   * applying all the improvements (items + solar)
   *
   * @return newBill
   */
  monthlyBillAfterEfficiency: function () {
    var connectionFee = this.get('connectionFee'),
      oldBill = this.get('potential.utilityUsage.averageElectricityBill') || 0,
      type = this.get('savingsCalculationType'),
      originalUsage = this.get('potential.utilityUsage.annualKwh'),
      usageAfter = this.get('annualUsageAfterEfficiency'),
      solarProduction = this.get('ac_annual'),
      avgCostElectricity = this.get('potential.utilityUsage.kwhPrice'),
      selectedItems = this.get('selectedItems'),
      remainingUtilityForYear,
      usageAfterPercent, usageSum = usageAfter + solarProduction,
      newBill;

    if (type == 'avoided') {
      return oldBill - (this.get('monthlyAvoidedCostOfEnergy') || 0);
    } else {
      selectedItems.forEach(function (item) {
        usageSum += item.get('savingsCalculation.annualKwhSavings');
      });

      usageAfterPercent = usageAfter / usageSum;
      remainingUtilityForYear = usageAfterPercent * originalUsage;

      newBill = (remainingUtilityForYear * avgCostElectricity) / 12;

      return newBill;
    }

  }
    .
    property(
      'connectionFee', 'potential.utilityUsage.annualKwh', 'annualUsageAfterEfficiency',
      'ac_annual', 'potential.utilityUsage.kwhPrice', 'selectedItems',
      'selectedItems.@each.savingsCalculation.annualKwhSavings',
      'potential.utilityUsage.averageElectricityBill', 'savingsCalculationType', 'monthlyAvoidedCostOfEnergy'
    ),

  savingsPerMonth: function () {
    var sum = 0;

    this.get('billableItems').forEach(function (item) {
      sum += item.get('avgMonthlyUSDSavings');
    });

    return sum;
  }
    .
    property('billableItems.@each.avgMonthlyUSDSavings'),

  annualUsageAfterEfficiency: function () {
    var sum = 0,
      monthly = this.get('monthlyUsageAfterEfficiency');

    months.shortCodes.forEach(function (month) {
      sum += monthly.get(month);
    });

    return sum;
  }
    .
    property('monthlyUsageAfterEfficiency'),

  monthlyUsageAfterEfficiency: function () {
    var productSavings = [],
      solarProduction = this.get('pvwatts.firstObject.ac_monthly') || [],
      usageCalendar = this.get('potential.utilityUsage.usageCalendar'),
      usage = Ember.Object.create(), currentUsage;

    this.get('selectedItems').forEach(function (item) {
      productSavings.push(item.get('savingsCalculation.monthlyKwhSavings'));
    });

    months.shortCodes.forEach(function (month, i) {
      currentUsage = parseFloat(usageCalendar.get(month)) || 0;

      productSavings.forEach(function (ps) {
        currentUsage -= ps[month] || 0;
      });

      currentUsage -= solarProduction[i] || 0;

      usage.set(month, currentUsage);
    });

    return usage;
  }
    .
    property('potential.utilityUsage.usageCalendar.changedMonths',
      'pvwatts.firstObject.ac_monthly',
      'selectedItems.@each.savingsCalculation.monthlyKwhSavings'
    ),

  annualProduction: function () {
    var solarProduction = this.get('pvwatts.firstObject.ac_monthly') || [],
      usageCalendar = this.get('potential.utilityUsage.usageCalendar'),
      total = 0;

    months.shortCodes.forEach(function (month, i) {
      total += (parseFloat(usageCalendar.get(month)) || 0);
      total += (solarProduction[i] || 0);
    });

    return total;
  }.property('pvwatts.firstObject.ac_monthly', 'potential.utilityUsage.usageCalendar.changedMonths'),

  productionPercentage: function () {
    var total = this.get('potential.utilityUsage.sumUsage') || 1,
      after = this.get('annualUsageAfterEfficiency') || 0;
    return 100 - after / total * 100;
  }.property('annualUsageAfterEfficiency', 'proposal.potential.utilityUsage.sumUsage'),

  monthlyItemsKwhSavings: function () {
    var items = this.get('selectedItems'),
      savings = Ember.Object.create(),
      sum;
    months.shortCodes.forEach(function (code) {
      sum = 0;

      items.forEach(function (item) {
        sum += item.get('savingsCalculation.monthlyKwhSavings.' + code) || 0;
      });

      savings.set(code, sum);
    });

    return savings;
  }
    .
    property('selectedItems', 'selectedItems.@each.savingsCalculation.monthlyKwhSavings')

})
;
