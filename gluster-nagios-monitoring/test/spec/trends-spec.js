'use strict';

describe('Trends tests', function() {
    beforeEach(function() {
        module('plugin.trendsTab');
    });
    describe('Graph Utils tests', function() {
        var graphUtilsHandler;
        var tempUrl = "http://10.3.12.50/pnp4nagios/image?host=nagios-rhsc-client&srv=Volume_Utilization_-_data-vol";
        var config = {
                pnp4nagiosUrl : "http://10.3.12.50",
                showDashboard : "true",
                messageOrigins : "localhost.localdomain:8080"
        };
        var tConfig = {
                showDashboard : "true",
                messageOrigins : "localhost.localdomain:8080"
        }
        var entityType = "host";
        var entity = "nagios-rhsc-client";
        var service = "Volume_Utilization_-_data-vol";
        beforeEach(inject(function(graphUtils) {
            graphUtilsHandler = graphUtils;
        }));
        it("Should create the url appropriately", function() {
            var url = "";
            if(!config.pnp4nagiosUrl) {
                url = "http://localhost.localdomain:8080";
            } else {
                url = config.pnp4nagiosUrl;
            }
            var result = url + graphUtilsHandler.createUrlOffset(entityType , entity , service, config);
            expect(result).toEqual((!config.pnp4nagiosUrl) ? "http://localhost.localdomain:8080" + "/pnp4nagios/image?host=nagios-rhsc-client&srv=Volume_Utilization_-_data-vol" : tempUrl);
            
            var result = url + graphUtilsHandler.createUrlOffset(entityType , entity , service, tConfig);
            expect(result).toEqual((!config.pnp4nagiosUrl) ? "http://localhost.localdomain:8080" + "/pnp4nagios/image?host=nagios-rhsc-client&srv=Volume_Utilization_-_data-vol" : tempUrl);
        });
        it("Url utils test", function() {
            var result = graphUtilsHandler.trimStartAndStopTimeFromUrl(tempUrl);
            expect(result).toEqual(tempUrl);
            var today = "16.4.2014+06:00:00";
            var yesterday = "15.4.2014+06:00:00"
            var resultUrl = graphUtilsHandler.appendTimeToUrl(tempUrl, yesterday, today);
            expect(resultUrl).toEqual(tempUrl + "&start=" + yesterday + "&end=" + today);
            result = graphUtilsHandler.trimStartAndStopTimeFromUrl(resultUrl);
            expect(result).toEqual(tempUrl);
        });
    });
    describe('dataManager tests', function() {
        var dataManagerHandle, $scope, $httpBackend;
        var selectedEntityType = "System";
        var clusterId = "00000001-0001-0001-0001-000000000001";
        var selectedEntity = "dist-rep";
        var selectedEntityParentId = "00000001-0001-0001-0001-000000000001";
        var config = {
                pnp4nagiosUrl : "http://10.3.12.50",
                showDashboard : "true",
                messageOrigins : "localhost.localdomain:8080"
        };
        beforeEach(inject(function($injector, dataManager) {
            dataManagerHandle = dataManager;
            $httpBackend = $injector.get('$httpBackend');
        }));
        it("should form urls correctly given the entity selected details", function() {
            expect($httpBackend).toBeDefined();
            expect(selectedEntity).toBeDefined();
            expect(selectedEntityParentId).toBeDefined();
            expect(dataManagerHandle).toBeDefined();

            dataManagerHandle.init(selectedEntityType, selectedEntity, selectedEntityParentId, clusterId, config);
            $httpBackend.when('GET', '/api/clusters').respond({
                'cluster':[
                           {'id':'00000001-0001-0001-0001-000000000001', 'name': 'cluster-1', 'descrtiption': 'cluster1'}
                       ]
            });
            $httpBackend.flush();
            var graphs = dataManagerHandle.getGraphs();
            expect(graphs).toBeDefined();
            expect(graphs.length).toEqual(1);
            expect(graphs[0]).toContain("http://10.3.12.50/pnp4nagios/image?host=cluster-1&srv=Cluster_Utilization");
        });
    });
});