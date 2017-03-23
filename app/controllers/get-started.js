import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend(Ember.Evented, {

  /**
   * init controller
   */
  init: function () {
  },

  actions: {
	  deletePotentials () {
		  let newPotentials = this.get('potentials')
		  let selectedPotentials = newPotentials.filterBy('actionSelected', true)
		  
		  newPotentials.removeObjects(selectedPotentials)
		  
		  this.trigger('updateTable')
		  
		  let promises = selectedPotentials.map((item, index) => item.destroyRecord())
		  
		  Promise.all(promises); //.then(()=>this.refreshPotentials())
		  
	  },
	  
    finishCreatePotential: function(potential) {
      console.log('ation controller');
      this.transitionToRoute('get-started.item.index', potential);
    },

    /**
     * this action will save a proposal to rest api
     * @param obj
     */
    saveProposalToApi: function (obj) {


      //set the object received by the components and
      //attach this to current proposal
      var proposal = this.get('proposal');
      proposal.set(obj.key, obj.value);

      //we should be able to get the current potential here
      proposal.set('potential', this.model);

      //console.log(proposal.get('potential').get('address'));
      //console.log(proposal.get('potential').get('id'));
      var self = this;

      var saveSuccess = function (model) {
        //console.log(prop);
        self.set('proposal', model);

        NProgress.done();
      };

      var saveFail = function () {
        //todo :)
      };

      proposal.save().then(saveSuccess);
    },


    refreshPotentials: function() {
      this.refreshPotentials()
    }
	
  },
  
  refreshPotentials() {

      Ember.$.ajax({
        url: config.apiHost + '/api/dev/potentials'
      }).then(() =>{
        this.store.findAll('potential').then((data) => {
          this.set('potentials', data);
        })
      });
    },

  potentialChanged: function () {

    var potential = this.get('model');

    //this should be fucking created when this is executed
    var proposal = this.get('proposal');
    //proposal.set('potential', potential);


  }.observes('model'),

  proposalChanged: function () {

  }.observes('proposal')


});
