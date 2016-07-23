(function () {
	var cloud66Datasource = function (settings, updateCallback) {
		var self = this;
		var updateTimer = null;
		var currentSettings = settings;
		// Update every 15 seconds
		var refreshFrequency = 15 * 1000;

		function updateRefresh(refreshTime) {
			if (updateTimer) {
				clearInterval(updateTimer);
			}

			updateTimer = setInterval(function () {
				self.updateNow();
			}, refreshTime);
		}

		updateRefresh(refreshFrequency);

		this.updateNow = function () {

			var url = '/public/sample.json';//'https://app.cloud66.com/api/3/stacks.json';

			self.combinePages(url, []).then(updateCallback);
		}

		this.combinePages = function (url, acc) {
			if (!url)
				return acc;
			return $.ajax({
				url: url,
				dataType: 'JSON',
				type: 'GET',
				headers: {
					'Authorization': currentSettings.personal_token
				}
			}).then(function(data) {
				return self.combinePages(data.pagination.next,
					acc.concat(data.response));
			});
		}

		this.onDispose = function () {
			clearInterval(updateTimer);
			updateTimer = null;
		}

		this.onSettingsChanged = function (newSettings) {
			currentSettings = newSettings;
			updateRefresh(refreshFrequency);
			self.updateNow();
		}
	};

	freeboard.loadDatasourcePlugin({
		type_name: 'Cloud66',
		settings: [
			{
				name: 'personal_token',
				display_name: 'Personal Token',
				type: "text"
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new cloud66Datasource(settings, updateCallback));
		}
	});

}());
