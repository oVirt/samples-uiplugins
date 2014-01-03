'use strict';

(function (mod) {

    mod.value('pluginName', 'ProgressBar');

    mod.factory('pluginApi', ['$window', 'pluginName', function ($window, pluginName) {
        return $window.parent.pluginApi(pluginName);
    }]);

    var initSvc = function (pluginApi) {
        return {
            bootstrapPlugin: function () {
                pluginApi.register({
                    UiInit: function () {
                        pluginApi.addMainTab(
                            'Progress', 'progress-tab', 'plugin/ProgressBar/progress-tab.html'
                        );
                    }
                });
                pluginApi.ready();
            }
        };
    };

    mod.factory('InitSvc', ['pluginApi', initSvc]);

}(
    angular.module('plugin.init.service', [])
));
