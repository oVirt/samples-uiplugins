'use strict';

(function (mod) {

    // http://angular-tips.com/blog/2013/08/understanding-service-types/
    // http://blog.jdriven.com/2013/03/how-to-create-singleton-angularjs-services-in-4-different-ways/

    mod.value('pluginName', 'AngularTest');

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
