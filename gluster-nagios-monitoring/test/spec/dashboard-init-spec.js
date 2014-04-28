'use strict';

testUtil.describeModule("plugin.init", function() {

	describe('DashboardInit', function() {

		var pluginApiMock;
		var eventHandlerObject;
		var initService;
		var config = {
		        url : "10.3.12.50/pnp4nagios",
		        showDashboard : "true",
		        messageOrigins : "localhost.localdomain:8080"
		};
		var apiOptions = {
                allowedMessageOrigins: config.messageOrigins
        };

		beforeEach(function () {
			pluginApiMock = jasmine.createSpyObj('pluginApiMock', ['register', 'ready']);

			pluginApiMock.register.andCallFake(function(obj) {
				eventHandlerObject = obj;
			});

			module(function ($provide) {
				$provide.value('pluginApi', pluginApiMock);
			});

			pluginApiMock.configObject = function() {
                return config;
            };
            pluginApiMock.options = function(obj) {
            };
			inject(function ($injector){
				initService = $injector.get('initService');
			});
		});

		it('should use pluginApi to register the plugin', function () {
			expect(eventHandlerObject).toBeDefined();
			expect(initService).toBeDefined();

			initService.bootstrapPlugin();

			expect(pluginApiMock.register).toHaveBeenCalled();
			expect(pluginApiMock.register.callCount).toEqual(2);
			expect(eventHandlerObject).toBeDefined();

			expect(pluginApiMock.ready).toHaveBeenCalled();
			expect(pluginApiMock.ready.callCount).toEqual(2);

		});


	});

});