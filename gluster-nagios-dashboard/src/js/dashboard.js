'use strict'

(function (mod) {

	var summaryCtrl = function ($scope, $q, clusterService, volumeService, hostService) {
		$scope.summary = {
			no_of_clusters: 0,
			hosts_up: 0,
			hosts_down: 0,
			volumes_up: 0,
			volumes_down: 0,
			bricks_up: 0,
			bricks_down: 0
		};

		clusterService.getClusters().
			then(function (clusters) {

				$scope.summary.no_of_clusters = clusters.length;
				var list = [];
				angular.forEach(clusters, function(cluster) {
					list.push(volumeService.getVolumes(cluster.id));
				});
				return $q.all(list);

			}).
			then(function (volumes_in_clustes) {

				var all_volumes = [];
				angular.forEach(volumes_in_clustes, function(volumes) {
					Array.prototype.push.apply(all_volumes, volumes);
				});
				var no_of_volumes = all_volumes.length;
				var volumes_up = all_volumes.filter(function(volume) {
					return volume.status.state === 'up';
				}).length;
				$scope.summary.volumes_up = volumes_up;
				$scope.summary.volumes_down = no_of_volumes - volumes_up;

				var list = [];
				angular.forEach(all_volumes, function(volume) {
					list.push(volumeService.getBricks(volume.cluster.id, volume.id));
				});
				return $q.all(list);

			}).
			then(function (bricks_in_volumes) {
				var all_bricks = [];
				angular.forEach(bricks_in_volumes, function(bricks) {
					Array.prototype.push.apply(all_bricks, bricks);
				});
				var no_of_bricks = all_bricks.length;
				var bricks_up = all_bricks.filter(function(brick) {
					return brick.status.state === 'up';
				}).length;
				$scope.summary.bricks_up = bricks_up;
				$scope.summary.bricks_down = no_of_bricks - bricks_up;
			});

		hostService.getHosts().
			then(function(hosts) {
				var no_of_hosts = hosts.length;
				var hosts_up = hosts.filter(function(host) {
					return host.status.state == 'up';
				}).length;

				$scope.summary.hosts_up = hosts_up;
				$scope.summary.hosts_down = no_of_hosts - hosts_up;
			});
	}

	var alertsCtrl = function($scope, alertService) {
		$scope.alerts = [];
		alertService.getAlerts().
			then(function (data) {
				$scope.alerts = data;
			});

		$scope.refreshAlerts= function () {
			$scope.alerts = [];
		}
	}

	var clustersCtrl = function($scope, clusterService, volumeService) {
		$scope.clusters = [];
		clusterService.getClusters().
			then(function (data) {
				$scope.clusters = data;
			}).
			then(function () {
				angular.forEach($scope.clusters, function(cluster, index) {
					volumeService.getVolumes(cluster.id).
						then(function (data){
							$scope.clusters[index].volumes = data;
						});
				});
			});
	}

	mod.controller("SummaryCtrl", ['$scope', '$q', 'ClusterService', 'VolumeService', 'HostService', summaryCtrl]);
	mod.controller("AlertsCtrl", ['$scope', 'AlertService', alertsCtrl]);
	mod.controller("ClustersCtrl", ['$scope', 'ClusterService', 'VolumeService', clustersCtrl]);
}(
	angular.module('dashboardApp', ['ui.bootstrap', 'plugin.dashboard.services'])
));
