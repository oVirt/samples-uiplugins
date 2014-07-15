'use strict';

(function (mod) {

    mod.factory('pluginApi', ['$window', 'pluginName', function ($window, pluginName) {
        return $window.parent.pluginApi(pluginName);
    }]);

    mod.factory('tabManager', ['pluginApi', '$window', 'urlUtil', function (pluginApi, $window, urlUtil) {
        var tabWindow, selectedTreeItem;
        return {
            addTabs: function () {
                if ((pluginApi.configObject().showDashboard && pluginApi.configObject().showDashboard === "true")) {
                    pluginApi.addMainTab('Dashboard', 'dashboard-tab', urlUtil.relativeUrl('dashboard.html'));
                }
                pluginApi.addMainTab('Trends', 'trends-tab', urlUtil.relativeUrl('trendsTab.html'));
            },
            setTabWindow: function (window) {
                tabWindow = window;
            },
            setSelectedTreeItem: function (item) {
                selectedTreeItem = item;
            },
            updateTab: function() {
                if (tabWindow && !selectedTreeItem) {
                    selectedTreeItem = {type : "System"};
                }
                if (tabWindow && selectedTreeItem && (window.parent.location.href.indexOf("#trends-tab") > -1)) {
                    var type = selectedTreeItem.type;
                    var entityId = selectedTreeItem.entity && selectedTreeItem.entity.id;
                    var entityName = selectedTreeItem.entity && selectedTreeItem.entity.name;
                    var entityClusterId = selectedTreeItem.entity && selectedTreeItem.entity.clusterId;
                    var configObject = pluginApi.configObject();
                    tabWindow.setTestData(type, entityId, entityName, entityClusterId, configObject);
                }
            }
        };
    }]);

    mod.factory('pluginEventHandlers', ['pluginName', 'tabManager', '$window', function (pluginName, tabManager, $window) {
        return {
            UiInit: function () {
                tabManager.addTabs();
            },
            MessageReceived: function (dataString, sourceWindow) {
                var data = JSON.parse(dataString);
                if (data && data.sender === pluginName) {
                    if (data.action === 'GetTabData') {
                        tabManager.setTabWindow(sourceWindow);
                        tabManager.updateTab();
                    }
                }
            },
            SystemTreeSelectionChange: function (selectedItem) {
                tabManager.setSelectedTreeItem(selectedItem);
                tabManager.updateTab();
            }
        };
    }]);

    mod.factory('initService', ['pluginApi', 'pluginEventHandlers', '$window', '$location', function (pluginApi, pluginEventHandlers, $window, $location) {
        return {
            bootstrapPlugin: function () { 
                var messageOrigin = pluginApi.configObject().messageOrigins;
                if (!messageOrigin) {
                    var port = (($location.port()) && ($location.absUrl().indexOf($location.port().toString()) > 0)) ? ":" + $location.port() : "";
                    messageOrigin = $location.protocol() + "://" + $location.host() + port;
                }
                var apiOptions = {
                        allowedMessageOrigins: messageOrigin
                };
                pluginApi.options(apiOptions);
                pluginApi.register(pluginEventHandlers);
                pluginApi.ready();
            }
        };
    }]);

    mod.run(['initService', function (initService) {
        initService.bootstrapPlugin();
    }]);

}(
    angular.module('plugin.init', ['plugin.common'])
));
