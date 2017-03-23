import {initializeFiles} from '../utils/files';

export function initialize(container, application) {
  initializeFiles();
}

export default {
  after: 'simple-auth',
  name: 'files',
  initialize: initialize
};
