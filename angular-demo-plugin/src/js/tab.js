'use strict';

(function (mod) {

    mod.factory('dataManager', ['$window', '$rootScope', function ($window, $rootScope) {
        var treeItemType, treeItemEntityId;
        return {
            exposeTestDataFunction: function () {
                $window.setTestData = function (type, entityId) {
                    treeItemType = type;
                    treeItemEntityId = entityId;
                    $rootScope.$apply();
                };
            },
            getTreeItemType: function () {
                return treeItemType || '(no type)';
            },
            getTreeItemEntityId: function () {
                return treeItemEntityId || '(no entity)';
            }
        };
    }]);

    mod.controller('tabController', ['$scope', 'dataManager', function ($scope, dataManager) {
        $scope.$watch(function() {
            return dataManager.getTreeItemType();
        }, function(newVal, oldVal) {
            $scope.treeItemType = newVal;
        });
        $scope.$watch(function() {
            return dataManager.getTreeItemEntityId();
        }, function(newVal, oldVal) {
            $scope.treeItemEntityId = newVal;
        });
    }]);

    mod.run(['messageUtil', 'dataManager', function (messageUtil, dataManager) {
        dataManager.exposeTestDataFunction();
        messageUtil.sendMessageToParent('GetTabData');
    }]);

}(
    angular.module('plugin.tab', ['plugin.common'])
));
