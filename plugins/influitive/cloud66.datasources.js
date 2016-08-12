(function () {
	var cloud66Datasource = function (settings, updateCallback) {
		var self = this;
		var updateTimer = null;
		var currentSettings = settings;
		// Update every 15 seconds
		var refreshFrequency = 15 * 1000;
		var apiUrl = 'https://app.cloud66.com/api/3/stacks.json';

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


			// Use proxy server to handle missing cors support.
			self.combinePages(1, []).then(updateCallback);
		}

		this.combinePages = function (page, acc, params) {
			if (!page)
				return acc;
			var url = apiUrl + '?page=' + page;
			// CORS support provided by https://jsonp.afeld.me/
			var requestURL = "https://jsonp.afeld.me/?url=" + encodeURI(url);
			return $.ajax({
				url: requestURL,
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
