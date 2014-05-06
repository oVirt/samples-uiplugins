'use strict';

(function (mod) {

    mod.factory('graphUtils', ['$window', function($window) {
        return {
            savePdf : function() {
                $window.print();
            },
            createUrlOffset : function(entityType , entity , service) {
                    return "/pnp4nagios/image?" + entityType + "=" + entity + "&srv=" + service;
            },
            formTimeInFormat : function(time) {
                return ((time.getDate() < 10) ? "0" + time.getDate() : time.getDate())+ "." + (((time.getMonth() + 1) < 10) ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1)) + "." + time.getFullYear() + "+" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            },
            appendTimeToUrl : function(url , startTimeString , endTimeString) {
                return url + "&start=" + startTimeString + "&end=" + endTimeString;
            },
            trimStartAndStopTimeFromUrl : function(url) {
                var lastIndex = url.lastIndexOf("&start=")
                if (lastIndex > 0) {
                    return url.substring(0 , lastIndex);
                }
                return url;
            },
            prepareDate : function(date, time) {
                var resultDate = new Date();
                resultDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                resultDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), resultDate.getMilliseconds());
                return resultDate;
            },
            getYesterday : function() {
                return new Date(new Date().setDate((new Date().getDate()) -1));
            },
            getGraphs : function(pnp4nagiosUrl, hosts, services) {
                var graphs = [];
                for(var i = 0 ; i < hosts.length ; i++) {
                    for(var j = 0 ; j < services.length ; j++) {
                        graphs[(i * services.length) + j] = pnp4nagiosUrl + this.createUrlOffset("host", hosts[i], services[j]);
                    }
                }
                return graphs;
            },
            appendGraphs : function(graphUrls, urlsToappend) {
                var len = graphUrls.length;
                for(var i = 0 ; i < urlsToappend.length ; i++) {
                    graphUrls[len + i] = urlsToappend[i];
                }
            }
        };
    }]);

    mod.factory('dataManager', ['$window', '$rootScope', '$location' , 'graphUtils', '$http', 'ClusterService', 'HostService','VolumeService', function ($window, $rootScope, $location, graphUtils, $http, clusterService, hostService, volumeService) {
        var treeItemType, treeItemEntityId, treeItemEntityName, treeItemClusterId, configObject;
        var startDate, stopDate;
        var startTime, stopTime;
        var graphsSet = false;
        var graphs = [];
        var pnp4NagiosUrl;
        var hostMatcherMaxIndexes;
        var serviceMatcherMaxIndexes;
        var engineUrl;
        return {
            init: function(selectedEntityType, selectedEntity, selectedEntityParentId, clusterId, config) {
                var hosts = [];
                hostMatcherMaxIndexes = [];
                serviceMatcherMaxIndexes = [];
                configObject = config;
                var services = [];
                pnp4NagiosUrl = this.getPnp4NagiosUrl();
                switch (selectedEntityType) {
                case "Host":
                    hosts[0] = selectedEntity;
                    services =  ["Cpu_Utilization" , "Memory_Utilization" , "Network_Utilization" , "Disk_Utilization"];
                    this.setGraphs(graphUtils.getGraphs(pnp4NagiosUrl,hosts,services));
                    break;
                case "Volume":
                case "Hosts":
                case "Volumes" :
                case "Cluster_Gluster" :
                case "System" :
                default :
                    this.prepareForRequest(selectedEntityType, selectedEntity, selectedEntityParentId, clusterId);
                    break;
                }
            },
            prepareForRequest : function(treeItemType, treeEntity, treeParentId, clusterId) {
                var j = 0;
                var hosts = [];
                var services = [];
                var caller = this;
                var graphUrls = [];
                switch (treeItemType) {
                case "Volume":
                    clusterService.getClusters().then(function(clusters) {
                        for(var i = 0 ; i < clusters.length ; i++) {
                            if (clusters[i].id == clusterId) {
                                hosts[j] = clusters[i].name;
                                j++;
                            }
                        }
                        
                        services = ["Volume_Utilization_-_" + treeEntity];
                        graphUrls = graphUtils.getGraphs(pnp4NagiosUrl,hosts,services);
                        var length = graphUrls.length;
                        volumeService.getBricks(clusterId, treeParentId).then(function(bricks) {
                            hostService.getHosts().then(function(thosts) {
                                for(var i = 0 ; i < bricks.length ; i++) {
                                    for(var j = 0 ; j < thosts.length ; j++) {
                                        if (bricks[i].server_id == thosts[j].id) {
                                            hosts = [];
                                            services = [];
                                            hosts[0] = thosts[j].name;
                                            services[0] = thosts[j].name + "." + bricks[i].name;
                                            var tGraphs = graphUtils.getGraphs(pnp4NagiosUrl,hosts,services);
                                            graphUtils.appendGraphs(graphUrls,tGraphs);
                                        }
                                    }
                                }
                                caller.setGraphs(graphUrls);
                            });
                        });
                    });
                    break;
                case "Hosts" :
                    hostService.getHosts().then(function(tHosts) {
                        services[0] = "Cpu_Utilization";
                        for(var i = 0 ; i < tHosts.length; i++) {
                            if (tHosts[i].cluster.id == treeParentId) {
                                hosts[j] = tHosts[i].name;
                                j++;
                            }
                        }
                        caller.setGraphs(graphUtils.getGraphs(pnp4NagiosUrl,hosts,services));
                        
                    });
                    break;
                case "Volumes" :
                case "Cluster_Gluster" :
                    hosts[0] = treeEntity;
                    volumeService.getVolumes(treeParentId).then(function(volumes) {
                       for(var i = 0 ; i < volumes.length ; i++) {
                           services[i] = ["Volume_Utilization_-_" + volumes[i].name];
                       }
                       caller.setGraphs(graphUtils.getGraphs(pnp4NagiosUrl,hosts,services));
                    });
                    break;
                case "System" :
                default :
                    clusterService.getClusters().then(function(clusters) {
                        services[0] = "Cluster_Utilization";
                        for(var i = 0 ; i < clusters.length ; i++) {
                            hosts[i] = clusters[i].name;
                        }
                        caller.setGraphs(graphUtils.getGraphs(pnp4NagiosUrl,hosts,services));
                    });
                    break;
                }                
            },
            getPnp4NagiosUrl : function() {
                /*
                 * If pnp4NagiosUrl is available in configuration object, it uses the same url or else,it will assume engine url to be
                 * the pnp4nagios server.
                 */
                var pnp4NagiosUrl = configObject.pnp4nagiosUrl;
                if (!pnp4NagiosUrl) {
                    var port = ($location.port()) ? ":" + $location.port() : "";
                    pnp4NagiosUrl = $location.protocol() + "://" + $location.host()  + port;
                }
                return pnp4NagiosUrl;
            },
            setGraphs : function(graphUrls) {
                graphs = [];
                var tGraphs = [];
                var today = new Date();
                var yesterday = graphUtils.getYesterday();
                if (!$rootScope.startDate) {
                    $rootScope.startDate = new Date(yesterday);
                }
                if (!$rootScope.startTime) {
                    $rootScope.startTime = new Date(yesterday);
                }
                if (!$rootScope.stopDate) {
                    $rootScope.stopDate = new Date(today);
                }
                if (!$rootScope.stopTime) {
                    $rootScope.stopTime = new Date(today);
                }

                /*
                 * Serves as event handler to set graphs to scope in tab controller
                 */
                graphsSet = true;

                for(var i = 0 ; i < graphUrls.length ; i++) {
                    graphs[i] = this.getGraphUtils().appendTimeToUrl(graphUrls[i] , this.getGraphUtils().formTimeInFormat(this.getGraphUtils().prepareDate($rootScope.startDate, $rootScope.startTime)) , this.getGraphUtils().formTimeInFormat(this.getGraphUtils().prepareDate($rootScope.stopDate, $rootScope.stopTime)));
                }
            },
            unsetGraphsSet : function() {
                graphsSet = false;
            },
            appendUrlsWithTime : function(urls , startDate, endDate) {
                var tempUrls  = [];
                for(var i = 0 ; i < urls.length ; i++) {
                    tempUrls[i] = graphUtils.appendTimeToUrl(graphUtils.trimStartAndStopTimeFromUrl(urls[i]), graphUtils.formTimeInFormat(startDate), graphUtils.formTimeInFormat(endDate));
                }
                return tempUrls;
            },
            exposeTestDataFunction: function () {
                var caller = this;
                $window.setTestData = function (type, entityId, entityName, entityClusterId, pluginConfig) {
                    treeItemType = type;
                    treeItemEntityId = entityId;
                    treeItemEntityName = entityName;
                    treeItemClusterId = entityClusterId;
                    caller.init(treeItemType, treeItemEntityName, treeItemEntityId, treeItemClusterId, pluginConfig);
                    $rootScope.$apply();
                };
            },
            getTreeItemType: function () {
                return treeItemType || '(no type)';
            },
            getTreeItemEntityId: function () {
                return treeItemEntityId || '(no entity)';
            },
            getTreeItemEntityName: function() {
                return treeItemEntityName || '(no entity name)';
            },
            getTreeItemClusterId: function() {
                return treeItemClusterId || '(no entity cluster id)';
            },
            getGraphs : function() {
                return graphs;
            },
            getGraphsSet : function() {
                return graphsSet;
            },
            getStartDate : function() {
                return startDate;
            },
            getStartTime : function() {
                return startTime;
            },
            getStopDate : function() {
                return stopDate;
            },
            getStopTime : function() {
                return stopTime;
            },
            setStartDate : function(graphStartDate) {
                startDate = graphStartDate;
            },
            setStopDate : function(graphStopDate) {
                stopDate = graphStopDate;
            },
            setStartTime : function(graphStartTime) {
                startTime = graphStartTime;
            },
            setStopTime : function(graphStopTime) {
                stopTime = graphStopTime;
            },
            getGraphUtils : function() {
                return graphUtils;
            }
        };
    }]);

    mod.controller('startDateTimeController', ['$scope', 'dataManager', '$window', '$rootScope', 'graphUtils', function ($scope, dataManager, $window, $rootScope, graphUtils) {
        $scope.today = function() {
            var today = new Date();
            var yesterday = graphUtils.getYesterday();
            $scope.startdt = new Date(yesterday);
            dataManager.setStartDate($scope.startdt);
            $rootScope.startDate = $scope.startdt;
        };
        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = ! $scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.startdt = null;
        };


        $scope.max = new Date();
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
                'year-format': "'yy'",
                'starting-day': 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.mytime = new Date();
        dataManager.setStartTime($scope.mytime);

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.options = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.mytime = d;
        };

        $scope.changed = function () {
            dataManager.setStartTime($scope.mytime);
        };

        $scope.clear = function() {
            $scope.mytime = null;
        };
        $scope.$watch(function() {
            return $scope.startdt;
        }, function(newVal, oldVal) {
            dataManager.setStartDate(newVal);
            $rootScope.startDate = newVal;
        });
        $scope.$watch(function() {
            return $rootScope.startDate;
        }, function(newVal, oldVal) {
            $scope.startdt = $rootScope.startDate;
        });
        $scope.$watch(function() {
            return $rootScope.startTime;
        }, function(newVal, oldVal) {
            $scope.mytime = $rootScope.startTime;
        });
    }]);

    mod.controller('stopDateTimeController', ['$scope', 'dataManager', '$window', '$rootScope', 'graphUtils', function ($scope, dataManager, $window, $rootScope, graphUtils) {
        $scope.today = function() {
            $scope.stopdt = new Date();
            dataManager.setStopDate($scope.stopdt);
        };
        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = ! $scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.stopdt = null;
        };


        $scope.max = new Date();
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.min = $rootScope.startDate;
            $scope.opened = true;
        };

        $scope.dateOptions = {
                'year-format': "'yy'",
                'starting-day': 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.mytime = new Date();
        dataManager.setStopTime($scope.mytime);

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.options = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.mytime = d;
        };

        $scope.changed = function () {
            dataManager.setStopTime($scope.mytime);
        };

        $scope.clear = function() {
            $scope.mytime = null;
        };
        $scope.$watch(function() {
            return $scope.stopdt;
        }, function(newVal, oldVal) {
            dataManager.setStopDate(newVal);
        });
        $scope.$watch(function() {
            return $rootScope.stopDate;
        }, function(newVal, oldVal) {
            $scope.stopdt = $rootScope.stopDate;
        });
        $scope.$watch(function() {
            return $rootScope.stopTime;
        }, function(newVal, oldVal) {
            $scope.mytime = $rootScope.stopTime;
        });
    }]);

    mod.controller('tabController', ['$scope', 'dataManager', '$window', '$rootScope', 'graphUtils',function ($scope, dataManager, $window, $rootScope, graphUtils) {
        $scope.dataManager = dataManager;
        $scope.graphs = [];

        $scope.$watch('dataManager.getStartDate()' , function(newVal, oldVal) {
            $rootScope.startDate = newVal;
            $scope.start = graphUtils.formTimeInFormat(newVal);
        });
        $scope.$watch('dataManager.getStopDate()' , function(newVal, oldVal) {
            $rootScope.stopDate = newVal;
            $scope.stop = graphUtils.formTimeInFormat(newVal);
        });
        $scope.$watch('dataManager.getStartTime()' , function(newVal, oldVal) {
            $rootScope.startTime = newVal;
            $scope.start = graphUtils.formTimeInFormat(graphUtils.prepareDate($rootScope.startDate, $rootScope.startTime));
        });
        $scope.$watch('dataManager.getStopTime()' , function(newVal, oldVal) {
            $rootScope.stopTime = newVal;
            $scope.stop = graphUtils.formTimeInFormat(graphUtils.prepareDate($rootScope.stopDate, $rootScope.stopTime));
        });
        $scope.$watch('dataManager.getGraphsSet()', function(newVal, oldVal) {
            if (newVal) {
                $scope.graphs = [];
                $scope.graphs = dataManager.getGraphs();
                dataManager.unsetGraphsSet();
            }
        });
        $scope.refresh = function() {
            var graphs = [];
            for(var i = 0 ; i < $scope.graphs.length ; i++) {
                var today = new Date();
                var yesterday = graphUtils.getYesterday();
                $rootScope.startDate = new Date(yesterday);
                $rootScope.startTime = new Date(yesterday);
                $rootScope.stopDate = new Date();
                $rootScope.stopTime = new Date();
                graphs[i] = graphUtils.trimStartAndStopTimeFromUrl($scope.graphs[i]);
                $scope.graphs[i] = graphs[i];
            }
        };
        $scope.getCustomGraphs = function() {
            var startDate = $rootScope.startDate;
            var startTime = $rootScope.startTime;
            var startFullDate = graphUtils.prepareDate(startDate , startTime);
            var latestGraphs = [];
            var stopDate = $rootScope.stopDate;
            var stopTime = $rootScope.stopTime;
            var stopFullDate = graphUtils.prepareDate(stopDate , stopTime);
            if ((($scope.graphs)) && ($scope.graphs.length > 0)) {
                latestGraphs = dataManager.appendUrlsWithTime($scope.graphs, startFullDate, stopFullDate);
                for(var i = 0 ; i < latestGraphs.length ; i++) {
                    $scope.graphs[i] = latestGraphs[i];
                }
            }
        };
        $scope.exportToPdf = function() {
            graphUtils.savePdf();
        };
    }]);

    mod.run(['messageUtil', 'dataManager', function (messageUtil, dataManager) {
        dataManager.exposeTestDataFunction();
        messageUtil.sendMessageToParent('GetTabData');
    }]);

}(
        angular.module('plugin.trendsTab', ['plugin.common', 'ui.bootstrap', 'plugin.dashboard.services'])
));
