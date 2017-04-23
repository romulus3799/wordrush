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

			function getCap12Phrases() {
				return $http.get('../data/valid-cap12-phrases.txt');
			}

			function getCap21Phrases() {
				return $http.get('../data/valid-cap21-phrases.txt');
			}

			function getEasyPhrases() {
				return $http.get('../data/easy-end-phrases.txt')
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
