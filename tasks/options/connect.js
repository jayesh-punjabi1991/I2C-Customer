var auth = require('../helpers/auth');
var proxy = require('../helpers/proxy');

var config = {
  /**
   * --------- ADD YOUR UAA CONFIGURATION HERE ---------
   *
   * This uaa helper object simulates NGINX uaa integration using Grunt allowing secure cloudfoundry service integration in local development without deploying your application to cloudfoundry.
   * Please update the following uaa configuration for your solution
   * You'll need to update clientId, serverUrl, and base64ClientCredential.
   */
  // Dev Server Settings
 //  uaa: {
 //    clientId: 'tradeConnectClient1',
 //    serverUrl: 'https://tradeconnect.predix-uaa.run.aws-usw02-pr.ice.predix.io',
 //    defaultClientRoute: '/dashboards',
 //    base64ClientCredential: 'dHJhZGVDb25uZWN0Q2xpZW50MTp0cmFkZWNvbm5lY3Q='
 // },
// Stage Server Settings
 uaa: {
   clientId: 'tradeconnect_stg',
   serverUrl: 'https://tca-stg.predix-uaa.run.aws-usw02-pr.ice.predix.io',
   defaultClientRoute: '/dashboards',
   base64ClientCredential: 'dHJhZGVjb25uZWN0X3N0Zzp0cmFkZWNvbm5lY3Rfc3Rn'
 },
  /**
   * --------- ADD YOUR SECURE ROUTES HERE ------------
   *
   * Please update the following object add your secure routes
   *
   * Note: Keep the /api in front of your services here to tell the proxy to add authorization headers.
   * You'll need to update the url and instanceId.
   */
  proxy: {
    '/api/view-service': {
      url: 'https://predix-views.run.aws-usw02-pr.ice.predix.io',
      instanceId: 'your-view-service-guid-here',
      pathRewrite: { '^/api/view-service': '/v1'}
    }
  }
};

module.exports = {
  server: {
    options: {
      port: 9000,
      base: 'public',
      open: true,
      hostname: 'localhost',
      middleware: function (connect, options) {
        var middlewares = [];

        //add predix services proxy middlewares
        middlewares = middlewares.concat(proxy.init(config.proxy));

        //add predix uaa authentication middlewaress
        middlewares = middlewares.concat(auth.init(config.uaa));

        if (!Array.isArray(options.base)) {
          options.base = [options.base];
        }

        var directory = options.directory || options.base[options.base.length - 1];
        options.base.forEach(function (base) {
          // Serve static files.
          middlewares.push(connect.static(base));
        });

        // Make directory browse-able.
        middlewares.push(connect.directory(directory));

        return middlewares;
      }
    }
  }
};
