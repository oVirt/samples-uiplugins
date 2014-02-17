'use strict';

describe('DashboardService tests', function() {

	var myVolumeService;

	beforeEach(function () {
		module('plugin.dashboard.services');
	});

	describe('ClusterService tests', function() {

		var $httpBackend,
			clusterService;

		beforeEach(inject(function ($injector, ClusterService) {
			clusterService = ClusterService;
			$httpBackend = $injector.get('$httpBackend');
		}));

		afterEach(function () {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it("should return the clusters", function() {
			$httpBackend.expectGET('/api/clusters').respond({
				'cluster':[
					{'id':'00000001-0001-0001-0001-000000000001', 'name': 'cluster-1', 'descrtiption': 'cluster1'}, 
					{'id':'00000001-0001-0001-0001-000000000002', 'name': 'cluster-2', 'descrtiption': 'cluster2'},
					{'id':'00000001-0001-0001-0001-000000000003', 'name': 'cluster-3', 'descrtiption': 'cluster3'}
				]
			});

			var clusters;
			clusterService.getClusters().
				then(function (data) {
					clusters = data;
				});

			$httpBackend.flush();
			expect(clusters.length).toEqual(3);
		});
	});

	describe('HostService tests', function() {

		var $httpBackend,
			hostService;

		beforeEach(inject(function ($injector, HostService) {
			hostService = HostService;
			$httpBackend = $injector.get('$httpBackend');
		}));

		afterEach(function () {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it("should return the hosts", function() {
			$httpBackend.expectGET('/api/hosts').respond({
				'host':[
					{'id':'00000001-0001-0001-0001-000000000001', 'name': 'host-1', 'descrtiption': 'host1'}, 
					{'id':'00000001-0001-0001-0001-000000000002', 'name': 'host-2', 'descrtiption': 'host2'},
					{'id':'00000001-0001-0001-0001-000000000003', 'name': 'host-3', 'descrtiption': 'host3'}
				]
			});

			var hosts;
			hostService.getHosts().
				then(function (data) {
					hosts = data;
				});

			$httpBackend.flush();
			expect(hosts.length).toEqual(3);
		});
	});

	describe('VolumeService tests', function() {

		var $httpBackend,
			volumeService;

		beforeEach(inject(function ($injector, VolumeService) {
			volumeService = VolumeService;
			$httpBackend = $injector.get('$httpBackend');
			
		}));

		afterEach(function () {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it("should return the volumes", function() {
			$httpBackend.expectGET('/api/clusters/00000001-0001-0001-0001-000000000001/glustervolumes').respond({
				'gluster_volume':[
					{'id':'00000001-0001-0001-0001-000000000001', 'name': 'volume-1'}, 
					{'id':'00000001-0001-0001-0001-000000000002', 'name': 'volume-2'}
				]
			});

			var volumes;
			volumeService.getVolumes('00000001-0001-0001-0001-000000000001').
				then(function (data) {
					volumes = data;
				});
			$httpBackend.flush();

			expect(volumes.length).toEqual(2);
		});
	});

	describe('AlertService tests', function() {

		var $httpBackend,
			alertService;

		beforeEach(inject(function ($injector, AlertService) {
			alertService = AlertService;
			$httpBackend = $injector.get('$httpBackend');
		}));

		afterEach(function () {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it("should return the alerts", function() {
			$httpBackend.expectGET('/api/events?search=severity%3Dalert').respond({
				'event':[
					{'id': '1', 'descrtiption': 'alert1'},
					{'id': '2', 'descrtiption': 'alert2'},
					{'id': '3', 'descrtiption': 'alert3'},
					{'id': '4', 'descrtiption': 'alert4'},
				]
			});

			var alerts;
			alertService.getAlerts().
				then(function (data) {
					alerts = data;
				});
			$httpBackend.flush();

			expect(alerts.length).toEqual(4);
		});
	});
});