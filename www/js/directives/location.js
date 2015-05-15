app.directive('myGovHubLocation',
function() {
	return {
		template: '\
			<ion-nav-buttons ng-if="hasCity" side="right">\
				<button ng-click="chooseCity($event)" class="button-icon">\
					<span class=" white">\
						<i class="fa fa-map-marker pink pad-r5"></i> {{city.displayName}}\
					</span>\
				</button>\
			</ion-nav-buttons>\
		',
		controller: [
			'$scope',
			'identity',
			'cities',
			'$ionicPopover',
			function($scope, Identity, Cities, $ionicPopover) {
				var cityId = Identity.getCityId();
				$scope.cities = Cities.all();
				if(cityId !== null)
				{
					$scope.hasCity = true;
					$scope.city = Cities.getCity(cityId);
				}
				else
				{
					$scope.hasCity = false;
				}

				$ionicPopover.fromTemplateUrl('templates/choose-city-popover.html', {
					scope: $scope,
				}).then(function(popover) {
					$scope.popover = popover;
				});

				$scope.chooseCity = function($event) {
					$scope.popover.show($event);
				};

				$scope.changeCity = function(cityId) {
					$scope.city = Cities.getCity(cityId);
					Identity.setCityId(cityId);
					$scope.popover.hide();
				};

			}
		]
	};
})
