import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: "id",

  attrs: {
    items: {
      embedded: 'always',
      serialize: 'records'
    },
    solarItem: {
      embedded: 'always',
      serialize: 'records'
    },
    utilityUsage: {
      embedded: 'always',
      serialize: 'records'
    },
    product: {
      embedded: 'always',
      serialize: 'records'
    },
    marketProfile: {
      embedded: 'always',
      serialize: 'records'
    },
    potential: {
      serialize: 'records',
      embedded: 'always'
    },
    proposal: {
      embedded: 'always',
      serialize: 'records'
    },
    pvwatts: {
      embedded: 'always',
      serialize: 'records'
    },
    marketItem: {
      embedded: 'always',
      serialize: 'records'
    },
    calculation: {
      embedded: 'always',
      serialize: 'records'
    },
    kwh: {
      embedded: 'always',
      serialize: 'records'
    },
    percent: {
      embedded: 'always',
      serialize: 'records'
    },
    federal: {
      embedded: 'always',
      serialize: 'records'
    },
    state: {
      embedded: 'always',
      serialize: 'records'
    },
    utility: {
      embedded: 'always',
      serialize: 'records'
    },
    tax: {
      embedded: 'always',
      serialize: 'records'
    },
    rebates: {
      embedded: 'always',
      serialize: 'records'
    },
    usageCalendar: {
      embedded: 'always',
      serialize: 'records'
    },
    billCalendar: {
      embedded: 'always',
      serialize: 'records'
    },
    loanOptions: {
      embedded: 'always',
      serialize: 'records'
    },
    tiers: {
      embedded: 'always',
      serialize: 'records'
    }
  }
});
