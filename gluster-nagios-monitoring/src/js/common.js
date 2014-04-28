'use strict';

(function (mod) {


    mod.value('pluginName', 'GlusterNagiosMonitoring');

    mod.factory('urlUtil', ['pluginName', function (pluginName) {
        return {
            relativeUrl: function (path) {
                return 'plugin/' + pluginName + '/' + path;
            }
        };
    }]);

    mod.factory('messageUtil', ['$window', 'pluginName', function ($window, pluginName) {
        return {
            sendMessageToParent: function (action) {
                var data = {
                    sender: pluginName,
                    action: action
                };
                $window.parent.postMessage(JSON.stringify(data), '*');
            }
        };
    }]);

}(
    angular.module('plugin.common', [])
));
