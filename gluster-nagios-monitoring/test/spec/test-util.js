'use strict';

var testUtil = {

    describeModule: function (moduleName, specDefinitions) {

        describe(moduleName, function () {

            beforeEach(function () {
                this.addMatchers({
                    toBeFunction: function () {
                        return angular.isFunction(this.actual);
                    }
                });
            });

            beforeEach(module(moduleName));
            specDefinitions();

        });

    }

};
