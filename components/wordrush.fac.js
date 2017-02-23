(function() {
    'use strict';
    
    angular
        .module("wordrush")
        .factory("wordRushFac", function($http) {

            function getValidWords() {
                return $http.get('../data/valid-words.txt');
            }
        
            function getLetterValues() {
                return $http.get('../data/letter-values.json')
            }
            
            function getStartPhrases() {
                return $http.get('../data/valid-start-phrases.txt')
            }

            function getInPhrases() {
                return $http.get('../data/valid-in-phrases.txt');
            }

            function getEndPhrases() {
                return $http.get('../data/valid-end-phrases.txt');
            }

            function getLetters() {
                return $http.get('../data/letters.txt');
            }
        
            function getCapPhrases() {
                return $http.get('../data/valid-cap-phrases.txt');
            }
           
            return {
                getValidWords   : getValidWords,
                getLetterValues : getLetterValues,
                getLetters      : getLetters,
                getStartPhrases : getStartPhrases,
                getInPhrases    : getInPhrases,
                getEndPhrases   : getEndPhrases,
                getCapPhrases   : getCapPhrases
            }
        })
})();

