var mainForm = angular.module('mainForm', ['ui.bootstrap']);

mainForm.controller('GlobalLoggingLevelController', ['$scope', function($scope){
	$scope.loggingLevelsData = {
  		loggingLevelOptions: [
			{value: 'error', label: 'Error'},
			{value: 'warn', label: 'Warn'},
			{value: 'info', label: 'Info'},
			{value: 'debug', label: 'Debug'}
		],
		selectedLoggingLevel: {value: 'warn', label: 'Warn'}
  	 };
}]);

mainForm.controller('AddServiceController', ['$scope', function($scope){
	$scope.serviceData = {
		serviceRepeatSelect: null,
  		serviceOptions: [
			{value: 'ebs', label: 'AWS Elastic Block Store'},
			{value: 'efs', label: 'AWS Elastic File System'},
			{value: 's3fs', label: 'AWS Simple Storage Service S3FS'},
			{value: 'rbd', label: 'Ceph RADOS Block Devices'},
			{value: 'scaleio', label: 'Dell EMC ScaleIO'},
			{value: 'isilon', label: 'Dell EMC Isilon'},
			{value: 'dobs', label: 'Digital Ocean Block Storage'},
			{value: 'fittedcloud', label: 'Fitted Cloud EBS Optimizer'},
			{value: 'gcepd', label: 'Google Compute Engine Persistent Disk'},
			{value: 'azureud', label: 'Microsoft Azure Unmanaged Disk'},
			{value: 'cinder', label: 'OpenStack Cinder'},
			{value: 'virtualbox', label: 'Oracle VirtualBox'}
		]
  	 };
}]);

mainForm.controller('AddServiceButtonController', ['$scope', '$rootScope', function($scope, $rootScope){
	  	$rootScope.services = [];
  
		$scope.addNewService = function() {
			if ($scope.services.length >= 1){
				alert('This generator only supports 1 service at this time. View the modules examples in the documentation to learn how to support multiple services.');
			} else {
				var serviceType = $scope.$parent.serviceData.serviceRepeatSelect
				if ( serviceType !== null) {
					var newServiceNo = $scope.services.length+1;
					if (serviceType == 'scaleio'){
						$scope.services.push({
							"id":newServiceNo,
							"type": serviceType,
							"insecure" : true,
							"thinOrThick" : "ThinProvisioned"
						});
					} else if (serviceType == 'isilon' || serviceType == 'efs' || serviceType == 'ebs' || serviceType == 'rbd' || serviceType == 'dobs' || serviceType == 'fittedcloud' || serviceType == 'gcepd' || serviceType == 'azureud' || serviceType == 's3fs' || serviceType == 'cinder'){
						$scope.services.push({
							"id":newServiceNo,
							"type": serviceType
						});
					} else if (serviceType == 'virtualbox'){
						$scope.services.push({
							"id":newServiceNo,
							"type": serviceType,
							"endpoint": "http://192.168.99.1:18083",
							"tls": false,
							"volumePath": "/Users/<your-name>/VirtualBox/Volumes",
							"controllerName": "SATA"
						});
					} 
				}
			}
		};

		$scope.downloadOutput = function(element) {
			var text = $(element).text();
			var nonBlockingSpace = new RegExp(String.fromCharCode(160), "g");
			text = text.replace(/^\s*\n/gm, "").replace(nonBlockingSpace, " ");
			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
			element.setAttribute('download', 'config.yml');
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		}
		

		$scope.copyOutput = function (element) {
		    range = document.createRange();
		    range.selectNode($(element)[0]);
		    window.getSelection().addRange(range);
		    document.execCommand('copy');
		}

		/* NOT USED YET
		$scope.removeService = function() {
			var lastItem = $scope.choices.length-1;
			$scope.choices.splice(lastItem);
		};
		*/
}]);

mainForm.filter('kvFilter', function(){
	return function (objects){
		var allKeys = []
		angular.forEach(objects, function (value, key) {
				allKeys.push(key);
            })
		return allKeys;
	};
});

mainForm.filter('emptyKvFilter', function(){
  	return function (objects){
  		var filteredObject = {};
  		angular.forEach(objects, function (value, key) {
  			if (value) filteredObject[key] = value;
  		});
  		return filteredObject;
  	};
});

mainForm.filter('noLogging', function(){
	return function (arrays){
		var allKeysArray = [];
		angular.forEach(arrays, function (x) {
			if (x.substring(0, 4) == "libS" && x != 'libSmainLoggingLevel') {
				allKeysArray.push(x);
			}
		})
		return allKeysArray;
	};
});

mainForm.filter('multiStringFilter', function(){
	return function (input, searchText, AND_OR) {
        var returnArray = [],
            // Split on single or multi space
            splitext = searchText.toLowerCase().split(/\s+/),
            // Build Regexp with Logical AND using "look ahead assertions"
            regexp_and = "(?=.*" + splitext.join(")(?=.*") + ")",
            // Build Regexp with logicial OR
            regexp_or = searchText.toLowerCase().replace(/\s+/g, "|"),
            // Compile the regular expression
            re = new RegExp((AND_OR == "AND") ? regexp_and : regexp_or, "i");

        for (var x = 0; x < input.length; x++) {
            if (re.test(input[x])) returnArray.push(input[x]);
        }
        /* View what the 2 regular expression look like
        console.log(regexp_or);
        console.log(regexp_and);*/
        return returnArray;
    }
})

mainForm.directive('yamlConfiguration', function(){
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: true, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'AE',
		//template: 'My services: {{services}}<br>My Logging Level: {{loggingLevelsData.selectedLoggingLevel.value}} </br>',
		templateUrl: 'output/yaml.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($rootScope, $scope, iElm, iAttrs, controller) {
			//console.log($rootScope);
		}
	};
});

$(document).ready(function(){
	$("#output").sticky({topSpacing:65});
	new Clipboard('#copyButton');
});
