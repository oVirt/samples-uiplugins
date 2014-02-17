'use strict';

(function (mod) {

	mod.value('pluginName', 'OvirtDashboard');

	mod.factory('pluginApi', ['$window', 'pluginName', function ($window, pluginName) {
		return $window.parent.pluginApi(pluginName);
	}]);

	var initPlugin = function (pluginApi) {
		return {
			initDashboardPlugin: function() {
				pluginApi.register({
					UiInit: function() {
						pluginApi.addMainTab(
							'Dashboard', 'dashboard', 'plugin/OvirtDashboard/dashboard.html'
						);
					}
				});
				pluginApi.ready();
			}
		};
	};

	mod.factory('InitPlugin', ['pluginApi', initPlugin]);

}(
	angular.module('plugin.dashboard.init', [])
));