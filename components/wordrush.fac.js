(function() {
	'use strict';

	angular
		.module("wordrush")
		.factory("wordRushFac", function($http) {

			function getValidWords() {
				return $http.get('/wordrush/data/valid-words.txt');
			}

			function getLetterValues() {
				return $http.get('/wordrush/data/letter-values.json')
			}

			function getStartPhrases() {
				return $http.get('/wordrush/data/valid-start-phrases.txt')
			}

			function getInPhrases() {
				return $http.get('/wordrush/data/valid-in-phrases.txt');
			}

			function getEndPhrases() {
				return $http.get('/wordrush/data/valid-end-phrases.txt');
			}

			function getLetters() {
				return $http.get('/wordrush/data/letters.txt');
			}

			function getCap12Phrases() {
				return $http.get('/wordrush/data/valid-cap12-phrases.txt');
			}

			function getCap21Phrases() {
				return $http.get('/wordrush/data/valid-cap21-phrases.txt');
			}

			function getEasyPhrases() {
				return $http.get('/wordrush/data/easy-end-phrases.txt')
			}

			function getDefLink(word) {
				return $http.get('http://www.dictionary.com/browse/' + word)
			}

			return {
				getValidWords	: getValidWords,
				getLetterValues	: getLetterValues,
				getLetters		: getLetters,
				getStartPhrases	: getStartPhrases,
				getInPhrases	: getInPhrases,
				getEndPhrases	: getEndPhrases,
				getCap12Phrases	: getCap12Phrases,
				getCap21Phrases	: getCap21Phrases,
				getEasyPhrases	: getEasyPhrases,
				getDefLink		: getDefLink
			}
		})
})();
