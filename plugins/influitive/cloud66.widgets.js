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

    freeboard.addStyle('.tw-th',
		'display:table-row; font-size: 1rem; color: #B88F51;');

    var cloud66Widget = function (settings) {

        var self = this;

        var currentSettings = settings;
		var displayElement = $('<div class="tw-display"></div>')
            .append($('<div class="tw-th"></div>')
                .append('<div class="tw-td">Name</div>')
                .append('<div class="tw-td">Status</div>')
                .append('<div class="tw-td">Health</div>')
                .append('<div class="tw-td">Git Branch</div>')
                .append('<div class="tw-td">Updated At</div>')
            );
        var projects = [];

        this.render = function (element) {
			$(element).empty();

            $(element).append(displayElement);
        }

        this.onSettingsChanged = function (newSettings) {
            projects = newSettings.projects ? newSettings.projects.split(',').map(function(p){
                return p.toUpperCase();
            }) : [];
        }

        this.getHeight = function() {
            return 5;
        }

        this.filterStacks = function(stack) {
            return stack.environment === currentSettings.environment && projects.indexOf(stack.name.toUpperCase()) > -1;
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (settingName == "stacks") {
                $(newValue.filter(self.filterStacks)).each(function (index, stack) {
                    var id = stack.uid;

                    var rowElement = $('<div class="tw-tr" id="'+id+'"></div>')
                        .append($('<div class="tw-td"></div>')
                            .append(self.buildNameElement(stack)))
                        .append($('<div class="tw-td"></div>')
                            .append(self.buildStatusElement(stack)))
                        .append($('<div class="tw-td"></div>')
                            .append(self.buildHealthElement(stack)))
                        .append($('<div class="tw-td"></div>')
                            .append(self.buildGitBranch(stack)))
                        .append($('<div class="tw-td"></div>')
                            .append(new Date(stack.updated_at).toLocaleString()))

                    var existingEl = $(displayElement).find('#'+id);
                    if (existingEl.length > 0)
                        existingEl.replaceWith(rowElement);
                    else
                        $(displayElement).append(rowElement);
                });

            }
        }

        this.buildNameElement = function (stack) {
            return stack.name;
        }

        this.buildStatusElement = function (stack) {
            return STATUS_CODES[stack.status];
        }

        this.buildHealthElement = function (stack) {
            return HEALTH_CODES[stack.health];
        }

        this.buildGitBranch = function (stack) {
            return stack.git_branch;
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
				name: 'environment',
				display_name: 'Environment',
				type: 'text'
			},
            {
                name: "stacks",
                display_name: "Stacks",
                type: "calculated"
            },
            {
                name: "projects",
                display_name: "Projects",
                type: "text",
                description: "Comma-separated for multiple projects"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new cloud66Widget(settings));
        }
    });

}());
