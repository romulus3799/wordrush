angular
.module('wordrush', ['ngMaterial'])
.config($mdThemingProvider => {

    $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('lime');
    
});