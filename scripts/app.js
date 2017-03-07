angular
.module('wordrush', ['ngMaterial'])
.config($mdThemingProvider => {

    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('lime');
});