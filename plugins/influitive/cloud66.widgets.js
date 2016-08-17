(function () {
	var STATUS_CODES = {
        0: {name: 'Pending analysis', className: 'inprogress' },
        1: {name: 'Deployed successfully', className: 'good' },
        2: {name: 'Deployment failed', className: 'failed' },
        3: {name: 'Analyzing', className: 'inprogress' },
        4: {name: 'Analyzed', className: 'inprogress' },
        5: {name: 'Queued for deployment', className: 'inprogress' },
        6: {name: 'Deploying', className: 'inprogress' },
        7: {name: 'Unable to analyze', className: 'unknown' }
    };

    var HEALTH_CODES = {
        0: {name: 'Unknown', className: 'unknown' },
        1: {name: 'Building', className: 'inprogress' },
        2: {name: 'Impaired', className: 'failed' },
        3: {name: 'Healthy', className: 'good' },
        4: {name: 'Failed', className: 'failed' }
    };

    freeboard.addStyle('.flx-header',
		'font-size: 1rem; color: #B88F51;');

    freeboard.addStyle('.flx-table',
		'width: 100%;');

    freeboard.addStyle('.flx-row',
		'display:flex; flex-direction: row; flex-grow: 0; width: 100%;');
    freeboard.addStyle('.flx-cell',
        'flex-grow: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; display: flex;');

    freeboard.addStyle('.flx-cell.small-cell',
        'width: 55px; flex: 1.3; justify-content: center;');

    freeboard.addStyle('.large-cell',
        'width: 120px;');

    freeboard.addStyle('.medium-cell',
        'width: 80px;');

    freeboard.addStyle('.date-cell',
        'flex: 5');


    freeboard.addStyle('.flx-exp',
        'flex: 2;');

    freeboard.addStyle('.row-alt:nth-child(odd)', 'background-color:rgba(0, 0, 0, 0.5);');

    freeboard.addStyle('.status', 'display: flex; align-items: center; justify-content: center;');
    freeboard.addStyle('.status:after', 'content: ""; width: 10px; height: 10px; border-radius: 50%;');
    freeboard.addStyle('.status.good:after', 'background-color: green;');
    freeboard.addStyle('.status.inprogress:after', 'background-color: yellow;');
    freeboard.addStyle('.status.failed:after', 'background-color: red;');
    freeboard.addStyle('.status.unknown:after', 'background-color: grey;');

    var cloud66Widget = function (settings) {

        var self = this;

        var currentSettings = settings;
        var titleElement = $('<div class="flx-header"></div>')
            .append('CLOUD66 STATUS');
		var displayElement = $('<div class="flx-table"></div>')
            .append(titleElement)
            .append($('<div class="flx-row flx-header" width="70"></div>')
                .append('<div class="flx-cell large-cell">Name</div>')
                .append('<div class="flx-cell small-cell">Status</div>')
                .append('<div class="flx-cell small-cell">Health</div>')
                .append('<div class="flx-cell medium-cell">Git Branch</div>')
                .append('<div class="flx-cell date-cell">Updated At</div>')
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
            $(displayElement).find('.tw-tr').remove();
        }

        this.getHeight = function() {
            if (projects && projects.length > 4) {
                return projects.length - 2;            }
            return 2;
        }

        this.filterStacks = function(stack) {
            return stack.environment === currentSettings.environment && projects.indexOf(stack.name.toUpperCase()) > -1;
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (settingName == "stacks") {
                $(newValue.filter(self.filterStacks)).each(function (index, stack) {
                    var id = stack.uid;

                    var rowElement = $('<div class="flx-row row-alt" id="'+id+'"></div>')
                        .append($('<div class="flx-cell large-cell"></div>')
                            .append(self.buildNameElement(stack)))
                        .append($('<div class="flx-cell small-cell"></div>')
                            .append(self.buildStatusElement(stack)))
                        .append($('<div class="flx-cell small-cell"></div>')
                            .append(self.buildHealthElement(stack)))
                        .append($('<div class="flx-cell medium-cell"></div>')
                            .append(self.buildGitBranch(stack)))
                        .append($('<div class="flx-cell date-cell"></div>')
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
            return $('<div class="status '+STATUS_CODES[stack.status].className+'"></div>')
        }

        this.buildHealthElement = function (stack) {
            return $('<div class="status '+HEALTH_CODES[stack.health].className+'"></div>')
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
