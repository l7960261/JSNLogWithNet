(function () {
   angular.module('logToServer', [])
      .service('$log', function () {
         this.log = function (msg) {
            JL().trace(msg); // will not sent to server.
         }
         this.debug = function (msg) {
            JL().debug(msg);
         }
         this.info = function (msg) {
            JL().info(msg);
         }
         this.warn = function (msg) {
            JL().warn(msg);
         }
         this.error = function (msg) {
            JL().error(msg);
         }
      })
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

   angular.module('app', ['logToServer'])
      .controller('home', ['$log', function ($log) {
         this.btn_click = function () {
            $log.info('123456789');

            // will cause errror
            var test = window.ViewModel.Shipping;
         };
      }]);

   angular.bootstrap($('#main'), ['app']);
})();