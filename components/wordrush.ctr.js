(() => {
    'use strict'

    angular
    .module('wordrush')
    .controller('wordrushCtrl', ($scope, $timeout, $interval, $http, $window, wordRushFac) => {

        wordRushFac.getValidWords().then(words => {
            $scope.words = String(words.data).split(',')
        })
        wordRushFac.getLetterValues().then(data => {
            $scope.letterValues = data.data
            console.log($scope.letterValues)
            console.log('Read letter values')
        })
        wordRushFac.getStartPhrases().then(phrases => {
            $scope.startPhrases = String(phrases.data).split(',')
            console.log('Read start phrases')
        })
        wordRushFac.getInPhrases().then(phrases => {
            $scope.inPhrases = String(phrases.data).split(',')
        })
        wordRushFac.getEndPhrases().then(phrases => {
            $scope.endPhrases = String(phrases.data).split(',')
        })
		wordRushFac.getCap12Phrases().then(phrases => {
            let arr = String(phrases.data).split(',')

            //split each string into an array of chars
            for(let i = 0; i < arr.length; i++) {
                arr[i] = [arr[i].charAt(0),arr[i].substring(1)]
            }
            $scope.cap12Phrases = arr
        })
		wordRushFac.getCap21Phrases().then(phrases => {
            let arr = String(phrases.data).split(',')

            //split each string into an array of chars
            for(let i = 0; i < arr.length; i++) {
                arr[i] = [arr[i].substring(0,arr[i].length),arr[i].charAt(arr[i].length-1)]
            }
            $scope.cap21Phrases = arr
        })
		wordRushFac.getEasyPhrases().then((phrases) => {
			$scope.easyPhrases = String(phrases.data).split(',')
		})
        wordRushFac.getLetters().then(letters => {
            $scope.letters = String(letters.data).split(',')
        })

		const TIMESTART = 60.00
		const TIMEDIV = 10

		$scope.starter = 'words that '
		const SEPARATOR = ', and '
		const MINLEN = 3
		const MAXLEN = 6

		const MAXTIMES = 3
		const MINTIMES = 1

		$scope.gameOn = false
		$scope.virgin = true

		$scope.applicant = ''
		$scope.submittedWords = []
		let correctWords = []
		let incorrectWords = []
		$scope.timer = 0
		$scope.timerDisplay = ''
		let promise
		$scope.condition = {
			name: '',
			startsAndEnds: false,
			startsWith: '',
			endsWith: '',
			contains: '',
			length: 1,
			containsTimes: 0
		}
		let finals = -1


		$scope.score = 0
		let scores = []
		$scope.bestWord = { word : '<none>', score : 0 }

		$scope.suggestion = ''
		$scope.suggLink = ''

		$scope.correctData = []
		$scope.incorrectData = []

		function resetPage() {
			$scope.gameOn = false
			$scope.virgin = true

			$scope.applicant = ''
			$scope.submittedWords = []
			correctWords = []
			incorrectWords = []
			$scope.timer = 0
			$scope.timerDisplay = ''
			promise
			$scope.condition = {
				name: '',
				startsAndEnds: false,
				startsWith: '',
				endsWith: '',
				contains: '',
				length: 1,
				containsTimes: 0
			}
			finals = -1


			$scope.score = 0
			scores = []
			$scope.bestWord = { word : '<none>', score : 0}

			$scope.suggestion = ''
			$scope.suggLink = ''

			$scope.correctData = []
			$scope.incorrectData = []
		}
        $scope.resetGame = () => {

            $scope.applicant = ''
            $scope.submittedWords = []
            correctWords = []
            incorrectWords = []
            $scope.timer = 0
            $scope.timerDisplay = ''

            $scope.condition = {
                name: '',
                startsAndEnds: false,
                startsWith: '',
                endsWith: '',
                contains: '',
                length: 1,
                containsTimes: 0
            }
            finals = -1

            $scope.score = 0
            scores = []
			$scope.bestWord = { word : '<none>', score : 0}

            $scope.suggestion = ''
            $scope.suggLink = ''

            $scope.correctData = []
            $scope.incorrectData = []

            console.log('game reset')
        }
        $scope.startGame = () => {
            $scope.gameOn = true
            $scope.virgin = false
            $scope.resetGame()

            generateCondition()

            //start timer
            $scope.timer = TIMESTART
            promise = $interval(fTimer, TIMEDIV)

            //focus on word input
            $timeout(() => {
                let e = $window.document.getElementById('word-input')
                if(e) {e.focus()}
            })
        }

        function fTimer() {
            //take time away, format to 2 decimals
            $scope.timer -= TIMEDIV/1000
            $scope.timer = Math.floor($scope.timer * 100) / 100
            $scope.timerDisplay = String($scope.timer)
            while($scope.timerDisplay.substring($scope.timerDisplay.indexOf('.')).length < 3) {
                $scope.timerDisplay += '0'
            }
            if($scope.timer <= 0) {
                $scope.endGame()
            }
        }

		//in-game
		function generateCondition() {
			$scope.condition.startsAndEnds = Math.random() >= .5

			if($scope.condition.startsAndEnds) {
				if(Math.random() >= .5) {
					var cand
					do {
						cand = randElement($scope.cap12Phrases)
						$scope.condition.startsWith = randElement(cand[0]).toUpperCase()
						$scope.condition.endsWith = randElement(cand[1]).toUpperCase()
					} while(found(cand,$scope.easyPhrases))
				} else {
					var cand
					do {
						cand = randElement($scope.cap12Phrases)
						$scope.condition.startsWith = randElement(cand[0]).toUpperCase()
						$scope.condition.endsWith = randElement(cand[1]).toUpperCase()
					} while(found(cand,$scope.easyPhrases))
				}
			} else {
				$scope.condition.startsWith = randElement($scope.startPhrases).toUpperCase()
				$scope.condition.endsWith = randElement($scope.endPhrases).toUpperCase()
			}

			$scope.condition.contains = randElement($scope.inPhrases).toUpperCase()
			$scope.condition.length = randIn(MINLEN, MAXLEN)
			$scope.condition.containsTimes = randIn(MINTIMES, MAXTIMES)

			$scope.condition.name = $scope.starter

			let lower = 0
			let upper = 2
			if($scope.condition.startsAndEnds) {
				$scope.condition.name +=
				'start with "' + $scope.condition.startsWith +
				'" and end with "' + $scope.condition.endsWith + '"'
			} else {

				for(let i = 0; i < 2; i++) {

					//randomly pick type of condition
					let temp = finals
					finals = randIn(lower,upper)

					lower = 3
					upper = 3

					//add condition description to name
					$scope.condition.name +=
					(finals === 0) ?
					'start with "' + $scope.condition.startsWith + '"' :
					(finals === 1) ?
					'end with "' + $scope.condition.endsWith + '"' :
					(finals === 2) ?
					'contain "' + $scope.condition.contains + '"' :
					//
					' contain at least ' + $scope.condition.length + ' letters'

					$scope.condition.name += SEPARATOR
					if(i === 1) finals = temp
					console.log('finals = ' + finals)
				}
				//delete separator from end
				$scope.condition.name = $scope.condition.name.substring(0, $scope.condition.name.length-SEPARATOR.length)
			}
		}

		$scope.meetsConditions = word => {

			let checked = false
			word = word.toUpperCase()
			if($scope.condition.startsAndEnds) {
				checked = word.startsWith($scope.condition.startsWith) &&
				word.endsWith($scope.condition.endsWith)
			} else {
				checked =
				(finals === 0) ?
				word.startsWith($scope.condition.startsWith) :
				(finals === 1) ?
				word.endsWith($scope.condition.endsWith) :
				//finals === 2
				word.includes($scope.condition.contains)
				checked = checked && (word.length >= $scope.condition.length)
			}

			//console.log(word + ': checked = ' + checked)
			//console.log(word + ': is word = ' + isWord(word))

			return checked && isWord(word)
		}

		function isWord(element) {
			element = element.toLowerCase()
            let minIndex = 0
            let maxIndex = $scope.words.length - 1
            let currentIndex
            let currentElement

            while (minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0
                currentElement = $scope.words[currentIndex]

                if (currentElement < element) {
                    minIndex = currentIndex + 1
                }
                else if (currentElement > element) {
                    maxIndex = currentIndex - 1
                }
                else {
                    return true
                }
            }
            return false
        }

		$scope.submitWord = word => {
			//on enter or spacebar
			if(event.keyCode == (13) || event.keyCode == (32)) {
				word = word.toUpperCase()

				//check if word has already been submitted
				let used = $.inArray(word, $scope.submittedWords) !== -1
				console.log(word + ': used = ' + used)

				$('#word-input').val('')

				console.log('Submitted ' + word)

				//if word is correct
				if($scope.meetsConditions(word) && !used) {
					$scope.submittedWords.push(word)
					correctWords.push(word)
					$('.in-game-word-display-title').after('<p class="correct dynamic">'+word.toUpperCase()+'</p>')

					//if word is incorrect
				} else if(!used) {
					$scope.submittedWords.push(word)
					incorrectWords.push(word)
					$('.in-game-word-display-title').after('<p class="incorrect dynamic">'+word.toUpperCase()+'</p>')

					//if word has been entered already
				} else {
					$('.in-game-word-display-title').after('<p class="used dynamic">'+word.toUpperCase()+'</p>')
				}
			} else if(event.keyCode == (38) || event.keyCode == (40)) {
				$('#word-input').val($scope.submittedWords[$scope.submittedWords.length-1])
			}
		}

		function suggestWord() {

			//create array of every word that meets condition
			let goodWords = []
			for(let i = 0; i < $scope.words.length; i++) {
				let w = $scope.words[i]
				if($scope.meetsConditions(w)) {
					goodWords.push(w)
				}
			}
			console.log('Amount of ' + $scope.condition.name + ': ' + goodWords.length)

			do {
				$scope.suggestion = randElement(goodWords)
			} while (isIn($scope.suggestion, $scope.submittedWords))

			$scope.suggLink = 'http://www.dictionary.com/browse/' + $scope.suggestion

			console.log('Suggestion: ' + $scope.suggestion)
		}

		//post-game
        function calculateScore() {
			console.log('Calculcating score')
            for (let w = 0; w < correctWords.length; w++) {
                let chars = correctWords[w].split('')
                let wordScore = 0

                for (let l = 0; l < chars.length; l++) {
                    let charScore = $scope.letterValues[chars[l]]
                    //console.log(chars[l] + ':' + charScore)
                    wordScore += charScore
                }
				console.log(wordScore)
                scores.push(wordScore)
            }
			//sort scores by descending
            $scope.score = scores.reduce((a,b)=>{return a+b}, 0)
        }

        $scope.endGame = () => {
            $interval.cancel(promise)
            $('.dynamic').remove()
            $scope.gameOn = false

            calculateScore()

            $scope.amtCorrect = correctWords.length
            generateResults()
            suggestWord()
        }

        function generateResults() {

			//generate correct word data
            for(let i = 0; i < correctWords.length; i++) {
                $scope.correctData.push({
                    word    : correctWords[i].toUpperCase(),
                    score   : scores[i],
                    id      : 'correct-data-'+i,
					link	: 'http://www.dictionary.com/browse/' + correctWords[i].toLowerCase()
                })
            }
			//sort correct words by descending score
			$scope.correctData.sort((a, b) => {
		    	return parseFloat(b.score) - parseFloat(a.score)
			})
			//get best word
			$scope.bestWord = $scope.correctData[0] ?
								$scope.correctData[0] :
								$scope.bestWord

			//sort incorrect words by ascending alphabet
            for(let i = 0; i < incorrectWords.length; i++) {
                $scope.incorrectData.push({
                    word    : incorrectWords[i].toUpperCase(),
                    id        : 'incorrect-data-'+i
                })
            }
			$scope.incorrectData.sort((a, b) => {
		    	return a.word - b.word;
			})
        }

        //helper functions
		function isIn(element, arr) {

            let minIndex = 0
            let maxIndex = arr.length - 1
            let currentIndex
            let currentElement

            while (minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0
                currentElement = arr[currentIndex]

                if (currentElement < element) {
                    minIndex = currentIndex + 1
                }
                else if (currentElement > element) {
                    maxIndex = currentIndex - 1
                }
                else {
                    return true
                }
            }
            return false
        }

		function found(el, arr) {
			for (var i = 0; i < arr.length; i++) {
				if(arr[i].includes(el) || el.includes(arr[i]) || el === arr) {
					return true
				}
			}
			return false
		}

		function randElement(arr) {
            let index = Math.floor(Math.random() * arr.length)
            return arr[index]
        }

        function randIn(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest()

            if ("withCredentials" in xhr) {
                // Check if the XMLHttpRequest object has a "withCredentials" property.
                // "withCredentials" only exists on XMLHTTPRequest2 objects.
                console.log('Request with credentials')
                xhr.open(method, url, true)
            }

            else if (typeof XDomainRequest != "undefined") {
                // Otherwise, check if XDomainRequest.
                // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                console.log('Request with XDomainRequest')
                xhr = new XDomainRequest()
                xhr.open(method, url)
            }

            else {
                // Otherwise, CORS is not supported by the browser.
                console.log('CORS not supported by browser.')
                xhr = null;
            }
            return xhr;
        }

        function getDefLink(word) {
            return 'http://www.dictionaryapi.com/api/v1/references/collegiate/xml/test?key=76c43e66-8626-4d18-8427-abdc18b19c2b'
        }
    })
})()
