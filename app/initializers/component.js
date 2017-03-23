export function initialize(container, application) {
  application.inject('component', 'store', 'store:main');
  application.inject('component', 'application', 'application:main');
  application.inject('view', 'application', 'application:main');
}

export default {
  name: 'component',
  initialize: initialize
};
