(function () {
   angular.module('app', ['logToServer'])
      .controller('home', ['$log', function ($log) {
         this.btn_click = function () {
            // log test
            $log.info('123456789');

            // will cause errror
            var test = window.ViewModel.Shipping;
         };
      }]);

   angular.bootstrap($('#main'), ['app']);
})();