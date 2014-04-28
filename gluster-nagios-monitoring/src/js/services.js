'use strict';

(function (mod) {

	var alertService = function ($http) {
		return {
			getAlerts: function() {
				return $http({method: 'GET', url: '/api/events?search=severity%3Dalert', headers: {Accept: 'application/json'}}).
					then(function (response) {
						if(typeof response.data.event !== 'undefined') {
							return response.data.event;
						}
						else {
							return [];
						}
					});
			}
		}
	}

	mod.factory('AlertService', ['$http', alertService]);

	var clusterService = function ($http) {
		return {
			getClusters: function() {
				return $http({method: 'GET', url: '/api/clusters', headers: {Accept: 'application/json'}}).
					then(function (response) {
						return response.data.cluster;
					});
			}
		}
	}

	mod.factory('ClusterService', ['$http', clusterService]);

	var hostService = function ($http) {
		return {
			getHosts: function() {
				return $http({method: 'GET', url: '/api/hosts', headers: {Accept: 'application/json'}}).
					then(function (response) {
						if(typeof response.data.host !== 'undefined') {
							return response.data.host;	
						}
						else {
							return [];
						}
					});
			}
		}
	}

	mod.factory('HostService', ['$http', hostService]);

	var volumeService = function ($http) {
		return {
			getVolumes: function(clusterId) {
				var volumesUrl = '/api/clusters/'+clusterId+'/glustervolumes';
				return $http({method: 'GET', url: volumesUrl, headers: {Accept: 'application/json'}}).
					then(function (response) {
						if(typeof response.data.gluster_volume !== 'undefined') {
							return response.data.gluster_volume;
						}
						else {
							return [];
						}
					});
			},

			getBricks: function(clusterId, volumeId) {
				var bricksUrl = '/api/clusters/'+clusterId+'/glustervolumes/'+volumeId+'/bricks';
				return $http({method: 'GET', url: bricksUrl, headers: {Accept: 'application/json'}}).
					then(function (response) {
						if(typeof response.data.brick !== 'undefined') {
							return response.data.brick;
						}
						else {
							return [];
						}
					});
			}
		}
	}

	mod.factory('VolumeService', ['$http', volumeService]);

}(
	angular.module('plugin.dashboard.services', [])
));