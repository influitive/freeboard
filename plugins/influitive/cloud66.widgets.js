(function () {
	var STATUS_CODES = {
        0: 'Pending analysis',
        1: 'Deployed successfully',
        2: 'Deployment failed',
        3: 'Analyzing',
        4: 'Analyzed',
        5: 'Queued for deployment',
        6: 'Deploying',
        7: 'Unable to analyze'
    };

    var HEALTH_CODES = {
        0: 'Unknown',
        1: 'Building',
        2: 'Impaired',
        3: 'Healthy',
        4: 'Failed'
    };


    var cloud66Widget = function (settings) {

        var self = this;

        var currentSettings = settings;
		var displayElement = $('<div class="tw-display"></div>');
		var titleElement = $('<h2 class="section-title tw-title tw-td"></h2>');

        this.title = 'Boops';

        this.render = function (element) {
			$(element).empty();

			$(displayElement)
				.append($('<div class="tw-tr"></div>').append(titleElement));

            $(element).append(displayElement);
        }

        this.onSettingsChanged = function (newSettings) {
            titleElement.append(newSettings.title);
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (settingName == "stacks") {
                console.log("New stacks:", newValue);
                $(newValue).each(function (index, stack) {
                    console.log('hey', stack)
                    var id = stack.id;
                    var rowElement = $('<div class="tw-tr" id="'+id+'"></div>')
                        .append($('<div class="tw-td"></div>')
                            .append(stack.name))
                        .append($('<div class="tw-td"></div>')
                            .append(self.buildStatusElement(stack)))
                        .append($('<div class="tw-td"></div>')
                            .append(self.buildHealthElement(stack)))

                    var existingEl = $(displayElement).find('#'+id);
                    if (existingEl.length > 0)
                        existingEl.replaceWith(rowElement);
                    else
                        $(displayElement).append(rowElement);
                });

            }
        }

        this.buildStatusElement = function (stack) {
            return STATUS_CODES[stack.status];
        }

        this.buildHealthElement = function (stack) {
            return HEALTH_CODES[stack.health];
        }

        this.onDispose = function () {

        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "cloud66_widget",
        display_name: "Cloud66 Widget",
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
			{
				name: 'environment',
				display_name: 'Environment',
				type: 'text'
			},
            {
                name: "stacks",
                display_name: "Stacks",
                type: "calculated"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new cloud66Widget(settings));
        }
    });

}());
