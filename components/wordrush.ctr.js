(() => {
    'use strict'
    
    angular
        .module('wordrush')
        .controller('wordrushCtrl', ($scope, $timeout, $http, wordRushFac) => {
        
        $scope.gameOn = false
        $scope.virgin = true
        
        wordRushFac.getValidWords().then(words => {
            $scope.words = String(words.data).split(',')
        })
        wordRushFac.getValidPhrases().then(phrases => {
            $scope.phrases = String(phrases.data).split(',')
        })
        wordRushFac.getLetters().then(letters => {
            $scope.letters = String(letters.data).split(',')
        })
        
        
        $scope.applicant = ''
        $scope.submittedWords = [] 
        $scope.submittedDisplay = ''
        $scope.amtCorrect = 0
        $scope.wordCondition = 'start with "e"'
        $scope.condition = {
            name: '',
            startsWith: '',
            contains: '',
            length: 1,
            containsLetter: '',
            containsLetterTimes: 0
        }
        
        $scope.startGame = () => {
            $scope.gameOn = true
            $scope.virgin = false
            console.log('gameOn = ' + $scope.gameOn)
            console.log('virgin = ' + $scope.virgin)
            
            $scope.applicant = ''
            $scope.submittedWords = []
            $scope.amtCorrect = 0
            
            $timeout($scope.endGame, 10000)
        }
        
        $scope.endGame = () => {
            $scope.gameOn = false
            $scope.submittedDisplay = $scope.submittedWords.join('\n')
        }
        

        $scope.isWord = element => {

            var minIndex = 0
            var maxIndex = $scope.words.length - 1
            var currentIndex
            var currentElement

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
        
        $scope.generateCondition = () => {
            //condition.startsWith = randElement($scope.phrases)
        }
        function randElement(arr) {
            var index = Math.floor(Math.random() * arr.length)
            return arr[index]
        }
        
        $scope.meetsConditions = word => {
            return $scope.startsWith(word, 'e') && 
                    $.inArray(word, $scope.submittedWords) === -1 &&
                    $scope.isWord(word)
        }
        
        $scope.submitWord = word => {
            if(event.keyCode == (13) || event.keyCode == (32)) {
                word = word.toLowerCase()
                $scope.submittedWords.push(word)
                $('#word-input').val('')
                console.log('Submitted ' + word)

                if($scope.isWord(word) && $scope.meetsConditions(word)) {
                    $scope.amtCorrect++
                }
            }
        }

        $scope.startsWith = (word,ex) => {
            return word.toLowerCase().startsWith(ex)
        }
    })
})()

