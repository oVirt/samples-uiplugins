'use strict';

describe('dashboardApp', function () {

	beforeEach(module('dashboardApp'));

	describe('AlertsController', function (){

		var scope,
			alertServiceMock,
			alertsDefer,
			createController,
			data = [
				{'id': '1', 'descrtiption': 'alert1'},
				{'id': '2', 'descrtiption': 'alert2'},
				{'id': '3', 'descrtiption': 'alert3'}
			];

		beforeEach(inject(function ($injector, $controller, $http, $q){
			var $rootScope = $injector.get('$rootScope');
			scope = $rootScope.$new(); 

			alertServiceMock = {
				getAlerts: function() {
					alertsDefer = $q.defer();
					return alertsDefer.promise;
				},
			};
			
			createController = function() {
				return $controller('AlertsCtrl', { 
					$scope: scope, AlertService: alertServiceMock
				});
			}; 
		}));

		it("should fetch the alerts", function (){
			spyOn(alertServiceMock, 'getAlerts').andCallThrough();
			var controller = createController();
			alertsDefer.resolve(data);
			scope.$apply();
			expect(alertServiceMock.getAlerts).toHaveBeenCalled();
			expect(scope.alerts).toBe(data);
		});
	});


	describe("ClustersController", function() {
		var scope,
			clusterServiceMock,
			clusterDefer,
			volumeServiceMock,
			volumeDefer,
			createController,
			clusters_data = [
				{'id':'00000001-0001-0001-0001-000000000001', 'name': 'cluster-1', 'descrtiption': 'cluster1'}, 
				{'id':'00000001-0001-0001-0001-000000000002', 'name': 'cluster-2', 'descrtiption': 'cluster2'},
				{'id':'00000001-0001-0001-0001-000000000003', 'name': 'cluster-3', 'descrtiption': 'cluster3'}
			],
			volumes_data = [
				{'id':'00000001-0001-0001-0001-000000000001', 'name': 'volume-1'}, 
				{'id':'00000001-0001-0001-0001-000000000002', 'name': 'volume-2'}
			];

		beforeEach(inject(function ($injector, $controller, $http, $q){
			var $rootScope = $injector.get('$rootScope');
			scope = $rootScope.$new(); 

			clusterServiceMock = {
				getClusters: function() {
					clusterDefer = $q.defer();
					return clusterDefer.promise;
				},
			};

			volumeServiceMock = {
				getVolumes: function(cluster_id) {
					volumeDefer = $q.defer();
					return volumeDefer.promise;
				}
			}
			
			createController = function() {
				return $controller('ClustersCtrl', { 
					$scope: scope, ClusterService: clusterServiceMock, VolumeService: volumeServiceMock
				});
			}; 
		}));

		it("should fetch the clusters and volumes", function (){
			spyOn(clusterServiceMock, 'getClusters').andCallThrough();
			spyOn(volumeServiceMock, 'getVolumes').andCallThrough();

			var controller = createController();

			clusterDefer.resolve(clusters_data);
			scope.$apply();

			expect(clusterServiceMock.getClusters).toHaveBeenCalled();
			expect(scope.clusters).toBe(clusters_data);

			volumeDefer.resolve(volumes_data);
			scope.$apply();
			volumeDefer.resolve(volumes_data);
			scope.$apply();
			volumeDefer.resolve(volumes_data);
			scope.$apply();

			console.log(scope.clusters);
			expect(volumeServiceMock.getVolumes.callCount).toEqual(3);
			//expect(scope.clusters[0].volumes).toBe(volumes_data);
		});
	});
});