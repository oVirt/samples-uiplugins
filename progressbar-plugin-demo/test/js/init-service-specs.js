'use strict';

testUtil.describeModule('plugin.init.service', function () {

    describe('InitSvc', function () {

        var pluginApiMock;
        var eventHandlerObject;
        var initSvc;

        beforeEach(function () {
            pluginApiMock = jasmine.createSpyObj('pluginApiMock', ['register', 'ready']);
            pluginApiMock.register.andCallFake(function (obj) {
                eventHandlerObject = obj;
            });

            module(function ($provide) {
                $provide.value('pluginApi', pluginApiMock);
            });

            inject(function ($injector) {
                initSvc = $injector.get('InitSvc');
            });
        });

        it('should use pluginApi to register the plugin', function () {
            expect(eventHandlerObject).not.toBeDefined();

            initSvc.bootstrapPlugin();

            expect(pluginApiMock.register).toHaveBeenCalled();
            expect(pluginApiMock.register.callCount).toEqual(1);
            expect(eventHandlerObject).toBeDefined();

            expect(pluginApiMock.ready).toHaveBeenCalled();
            expect(pluginApiMock.ready.callCount).toEqual(1);
        });

        it('should add progress-tab within UiInit callback', function () {
            pluginApiMock.addMainTab = jasmine.createSpy('addMainTab');

            initSvc.bootstrapPlugin();

            expect(eventHandlerObject.UiInit).toBeFunction();

            eventHandlerObject.UiInit();

            expect(pluginApiMock.addMainTab).toHaveBeenCalledWith(
                jasmine.any(String), 'progress-tab', jasmine.any(String)
            );
        });

    });

});
