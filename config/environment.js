/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'zoho-web',
    environment: environment,
    apiHost: '',
    baseURL: '/',
    locationType: 'hash',
    googleMap: {
      libraries: ['places', 'drawing']
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    PVWatts: {
      apiKey: "GrbAaHGCAcgnWkMJi1lN79cZGEbGgExfnm0w1kiR",
      host: "https://developer.nrel.gov/api/pvwatts/v5.json"
    },
    setOptions: {
      leadSource: 'Lead Source',
      leadStatus: 'Lead Status'
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    calc: {
      priceKwh: 0.13,
      kwhTax: 10,
      inflation: 0.02
    },

    charts: {
      //String - A legend template
      legendTemplate : "<ul class=\"<%=id%>-legend\"><% for (var i=0; i<data.datasets.length; i++){%><li><span style=\"background-color:<%=data.datasets[i].backgroundColor%>\"></span><%if(data.datasets[i].label){%><%=data.datasets[i].label%><%}%></li><%}%></ul>"

    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com maps.gstatic.com cdnjs.cloudflare.com maps.googleapis.com maxcdn.bootstrapcdn.com maps.gstatic.com",
      'font-src': "'self' fonts.gstatic.com maxcdn.bootstrapcdn.com",
      'connect-src': "'self' zoho.dev:8080 build.zoho.socketo.com:8080 localhost:8080 localhost:4200 developer.nrel.gov maps.gstatic.com connect.suntrific.com:8080 ws://localhost:35729 ws://0.0.0.0:35729 http://0.0.0.0:4200/csp-report",
      'img-src': "'self' data: zoho.dev:8080 localhost:8080 build.zoho.socketo.com connect.suntrific.com csi.gstatic.com *.googleapis.com maps.gstatic.com",
      'style-src': "'self' 'unsafe-inline' cdnjs.cloudflare.com maxcdn.bootstrapcdn.com fonts.googleapis.com maps.gstatic.com",
      'media-src': "'self'"
    }

  };



  if (environment === 'development') {
    // ENV.apiHost = 'http://zoho.dev:8080';
	ENV.apiHost = 'http://localhost:8080';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'staging') {
    ENV.apiHost = 'http://build.zoho.socketo.com:8080';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.apiHost = 'http://connect.suntrific.com:8080';
  }


  ENV['simple-auth'] = {
    authorizer: "authorizer:application",
    authenticator: "authenticator:application",
    store: "simple-auth-session-store:local-storage",
    crossOriginWhitelist: ['*']
  };
  return ENV;
};
