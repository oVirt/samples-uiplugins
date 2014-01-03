'use strict';

(function (mod) {

    var tabCtrl = function ($scope) {
        var categories = [
            { name: 'Storage', rank: 'Apprentice', progress: 41 },
            { name: 'Networking', rank: 'Adept', progress: 63 },
            { name: 'Virtualization', rank: 'Master', progress: 89 },
            { name: 'Gluster', rank: 'Novice', progress: 25 }
        ];

        var activeCategory = 1;

        $scope.getCategories = function () {
            return categories;
        };

        $scope.isActiveCategory = function (index) {
            return typeof index === 'number' && index === activeCategory;
        };

        $scope.setActiveCategory = function (index) {
            activeCategory = categories[index] !== undefined ? index : activeCategory;
        };

        $scope.getActiveCategory = function () {
            return categories[activeCategory];
        };
    };

    mod.controller('TabCtrl', ['$scope', tabCtrl]);

}(
    angular.module('plugin.tab.controller', [])
));
