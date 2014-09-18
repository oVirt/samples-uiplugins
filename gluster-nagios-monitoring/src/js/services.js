'use strict';

(function (mod) {

	var alertService = function ($http) {
		return {
			getAlerts: function() {
                var headers = {Accept: 'application/json', Prefer: 'persistent-auth'};
				return $http.get('/ovirt-engine/api/events?search=severity%3Dalert', {headers: headers}).
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
                var headers = {Accept: 'application/json', Prefer: 'persistent-auth'};
				return $http.get('/ovirt-engine/api/clusters', {headers: headers}).
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
                var headers = {Accept: 'application/json', Prefer: 'persistent-auth'};
				return $http.get('/ovirt-engine/api/hosts', {headers: headers}).
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
                var headers = {Accept: 'application/json', Prefer: 'persistent-auth'};
				var volumesUrl = '/ovirt-engine/api/clusters/'+clusterId+'/glustervolumes';
				return $http.get(volumesUrl, {headers: headers}).
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
                var headers = {Accept: 'application/json', Prefer: 'persistent-auth'};
				var bricksUrl = '/ovirt-engine/api/clusters/'+clusterId+'/glustervolumes/'+volumeId+'/bricks';
				return $http.get(bricksUrl, {headers: headers}).
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