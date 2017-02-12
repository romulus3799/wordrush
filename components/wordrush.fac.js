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
            
            function getStartPhrases() {
                return $http.get('../data/valid-start-phrases.txt');
            }

            return {
                getStartPhrases : getStartPhrases
            }
            
            function getInPhrases() {
                return $http.get('../data/valid-in-phrases.txt');
            }

            return {
                getInPhrases : getInPhrases
            }
            
            function getEndPhrases() {
                return $http.get('../data/valid-end-phrases.txt');
            }

            return {
                getEndPhrases : getEndPhrases
            }
            
            function getLetters() {
                return $http.get('../data/letters.txt');
            }

            return {
                getLetters : getLetters
            }
            
            
        })
})();

