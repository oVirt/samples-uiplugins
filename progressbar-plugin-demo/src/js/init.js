'use strict';

(function (mod) {

    mod.run(['InitSvc', function (initSvc) {
        initSvc.bootstrapPlugin();
    }]);

}(
    angular.module('plugin.init', ['plugin.init.service'])
));
