'use strict';

testUtil.describeModule("plugin.dashboard.init", function() {

	describe('DashboardInit', function() {

		var pluginApiMock;
		var eventHandlerObject;
		var initPlugin;

		beforeEach(function () {
			pluginApiMock = jasmine.createSpyObj('pluginApiMock', ['register', 'ready']);

			pluginApiMock.register.andCallFake(function(obj) {
				eventHandlerObject = obj;
			});

			module(function ($provide) {
				$provide.value('pluginApi', pluginApiMock);
			});

			inject(function ($injector){
				initPlugin = $injector.get('InitPlugin');
			});
		});

		it('should use pluginApi to register the plugin', function () {
			expect(eventHandlerObject).toBeUndefined();
			expect(initPlugin).toBeDefined();

			initPlugin.initDashboardPlugin();

			expect(pluginApiMock.register).toHaveBeenCalled();
			expect(pluginApiMock.register.callCount).toEqual(1);
			expect(eventHandlerObject).toBeDefined();

			expect(pluginApiMock.ready).toHaveBeenCalled();
			expect(pluginApiMock.ready.callCount).toEqual(1);

		});


	});

});