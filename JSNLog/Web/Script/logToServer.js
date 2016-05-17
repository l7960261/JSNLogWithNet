(function () {

   function logProvide($provide) {
      $provide.decorator('$log', logDecorator);
   }

   logProvide.$inject = ['$provide'];

   function logDecorator($delegate) {
      var origLog = $delegate.log;
      var origInfo = $delegate.info;
      var origDebug = $delegate.debug;
      var origWarn = $delegate.warn;
      var origError = $delegate.error;
      
      $delegate.log = function (msg) {
         JL().trace(msg);
         origLog.call(null, msg)
      };

      $delegate.info = function (msg) {
         JL().info(msg);
         origInfo.call(null, msg)
      };

      $delegate.debug = function (msg) {
         JL().debug(msg);
         origDebug.call(null, msg)
      };

      $delegate.warn = function (msg) {
         JL().warn(msg);
         origWarn.call(null, msg)
      };

      $delegate.error = function (msg) {
         JL().error(msg);
         origError.call(null, msg)
      };

      return $delegate;
   }

   logDecorator.$inject = ['$delegate'];

   angular.module('logToServer', [])
      .config(logProvide)
      .factory('$exceptionHandler', function () {
         return function (exception, cause) {
            JL().fatalException(cause, exception);
            throw exception;
         };
      })
      .factory('logToServerInterceptor', ['$q', function ($q) {
         var myInterceptor = {
            'request': function (config) {
               config.msBeforeAjaxCall = new Date().getTime();
               return config;
            },
            'response': function (response) {
               if (response.config.warningAfter) {
                  var msAfterAjaxCall = new Date().getTime();
                  var timeTakenInMs =
                        msAfterAjaxCall - response.config.msBeforeAjaxCall;
                  if (timeTakenInMs > response.config.warningAfter) {
                     JL('Angular.Ajax').warn({
                        timeTakenInMs: timeTakenInMs,
                        config: response.config,
                        data: response.data
                     });
                  }
               }
               return response;
            },
            'responseError': function (rejection) {
               var errorMessage = "timeout";
               if (rejection && rejection.status && rejection.data) {
                  errorMessage = rejection.data.ExceptionMessage;
               }
               JL('Angular.Ajax').fatalException({
                  errorMessage: errorMessage,
                  status: rejection.status,
                  config: rejection.config
               }, rejection.data);
               return $q.reject(rejection);
            }
         };
         return myInterceptor;
      }]);

})();