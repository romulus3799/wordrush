(function() {
    'use strict';
    
    angular
        .module("wordrush")
        .factory("wordRushFac", function($http) {

            function getValidWords() {
                return $http.get('../data/valid-words.txt');
            }

            return {
                getValidWords : getValidWords
            }
            
            function getValidPhrases() {
                return $http.get('../data/valid-phrases.txt');
            }

            return {
                getValidPhrases : getValidPhrases
            }
            
            function getLetters() {
                return $http.get('../data/letters.txt');
            }

            return {
                getLetters : getLetters
            }
            
            
        })
})();

