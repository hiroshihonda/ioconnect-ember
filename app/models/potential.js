import DS from 'ember-data';

export default DS.Model.extend({
  externalId: DS.attr(),
  potentialName: DS.attr(),
  address: DS.attr('string', {defaultValue: 'none'}),
  utility: DS.attr(),
  rateSchedule: DS.attr(),
  averageBill: DS.attr(),
  annualUsage: DS.attr(),
  leadStatus: DS.attr(),
  leadSource: DS.attr(),
  
  email: DS.attr(),
  phone: DS.attr(),
  proplength: DS.attr(),
  utilityUsage: DS.belongsTo('potential/utility'),

  proposals: DS.hasMany('proposal'),
  
  acceptedProposals: function() {
	  return this.get('proposals').filter((proposal)=>(proposal.get('accepted')))
  }.property('proposals.@each.accepted'),
  
  acceptedProposalsLength: function() {
	  return this.get('acceptedProposals.length')
  }.property('acceptedProposals'),

  proposalsLength: function(){
    let proplength = this.get("proplength");
    if (proplength == null)
      proplength = this.get("proposals.length");
    return proplength;
  }.property('proposals').property('proplength'),

  twentyFiveTimesBill: function(){
    return Number(this.get('averageBill')) * 25;
  }.property('averageBill')

});
