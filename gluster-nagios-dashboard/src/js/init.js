'use strict';

(function (mod) {

	mod.run(['InitPlugin', function(initPlugin){
		initPlugin.initDashboardPlugin();
	}]);

}(
	angular.module('plugin.init', ['plugin.dashboard.init'])
));