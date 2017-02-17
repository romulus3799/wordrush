(() => {
    'use strict'
    
    angular
        .module('wordrush')
        .controller('wordrushCtrl', ($scope, $timeout, $interval, $http, wordRushFac) => {
        
        $scope.gameOn = false
        $scope.virgin = true
        
        wordRushFac.getValidWords().then(words => {
            $scope.words = String(words.data).split(',')
        })
        wordRushFac.getStartPhrases().then(phrases => {
            $scope.startPhrases = String(phrases.data).split(',')
        })
        wordRushFac.getInPhrases().then(phrases => {
            $scope.inPhrases = String(phrases.data).split(',')
        })
        wordRushFac.getEndPhrases().then(phrases => {
            $scope.endPhrases = String(phrases.data).split(',')
        })
        wordRushFac.getCapPhrases().then(phrases => {
            var arr = String(phrases.data).split(',')
            
            //split each string into an array of chars
            for(let i = 0; i < arr.length; i++) {
                arr[i] = [arr[i].charAt(0),arr[i].charAt(1)]
            }
            $scope.capPhrases = arr
        })
        wordRushFac.getLetters().then(letters => {
            $scope.letters = String(letters.data).split(',')
        })
        
        $scope.applicant = ''
        $scope.submittedWords = [] 
        var correctWords = []
        var incorrectWords = []
        $scope.timer = 0
        $scope.timerDisplay = ''
        var promise
        const TIMESTART = 30.00
        const TIMEDIV = 10
        $scope.condition = {
            name: '',
            startsAndEnds: false,
            startsWith: '',
            endsWith: '',
            contains: '',
            length: 1,
            containsTimes: 0
        }
        const SEPARATOR = ', and '
        var finals = -1
        
        const MINLEN = 3
        const MAXLEN = 6
        
        const MINTIMES = 1
        const MAXTIMES = 3
        
        $scope.resetGame = () => {
            $scope.gameOn = false
            $scope.virgin = true
            
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
            
            console.log('game reset')
        }
        
        $scope.startGame = () => {
            $scope.gameOn = true
            $scope.virgin = false
            console.log('gameOn = ' + $scope.gameOn)
            console.log('virgin = ' + $scope.virgin)
            
            generateCondition()
            
            $scope.applicant = ''
            $scope.submittedWords = []
            correctWords = []
            incorrectWords = []
            
            $scope.timer = TIMESTART
            promise = $interval(fTimer, TIMEDIV)
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
        
        $scope.endGame = () => {
            $interval.cancel(promise)
            $scope.gameOn = false
            $scope.amtCorrect = correctWords.length
            displaySubmittedWords()
        }
        
        function displaySubmittedWords() {
            $( ".inner" ).append( "<p>Test</p>" );
            for(let i = 0; i < correctWords.length; i++) {
                $('#correct-words').append('<p class="correct">    '+correctWords[i].toUpperCase()+'</p>')
            }
            for(let i = 0; i < incorrectWords.length; i++) {
                $('#incorrect-words').append('<p class="incorrect">    '+incorrectWords[i].toUpperCase()+'</p>')
            }
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
        
        function generateCondition() {
            $scope.condition.startsAndEnds = Math.random() >= .5
            
            if($scope.condition.startsAndEnds) {
                var cap = randElement($scope.capPhrases)
                $scope.condition.startsWith = randElement(cap[0])
                $scope.condition.endsWith = randElement(cap[1])
            } else {
                $scope.condition.startsWith = randElement($scope.startPhrases)
                $scope.condition.endsWith = randElement($scope.endPhrases)
            }
            
            $scope.condition.contains = randElement($scope.inPhrases)
            $scope.condition.length = randIn(MINLEN, MAXLEN)
            $scope.condition.containsTimes = randIn(MINTIMES, MAXTIMES)
            
            $scope.condition.name = 'words that '
            
            var lower = 0
            var upper = 2
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
            
            var checked = false
            
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
            
            console.log(word + ': checked = ' + checked)
            console.log(word + ': is word = ' + $scope.isWord(word))
            
            return  checked && $scope.isWord(word)
        }
        
        $scope.submitWord = word => {
            //on enter or spacebar
            if(event.keyCode == (13) || event.keyCode == (32)) {
                word = word.toLowerCase()
                
                //check if word has already been submitted
                var used = $.inArray(word, $scope.submittedWords) !== -1
                console.log(word + ': used = ' + used)
                
                $('#word-input').val('')
                
                console.log('Submitted ' + word)
                
                //if word is correct
                if($scope.meetsConditions(word) && !used) {
                    $scope.submittedWords.push(word)
                    correctWords.push(word)
                    $('.in-game-word-display-title').after('<p class="correct">'+word.toUpperCase()+'</p>')
                    
                //if word is incorrect
                } else if(!used) {
                    $scope.submittedWords.push(word)
                    incorrectWords.push(word)
                    $('.in-game-word-display-title').after('<p class="incorrect">'+word.toUpperCase()+'</p>')
               
                //if word has been entered already
                } else {
                    $('.in-game-word-display-title').after('<p class="used">'+word.toUpperCase()+'</p>')
                }
            }
        }
        
        function randElement(arr) {
            var index = Math.floor(Math.random() * arr.length)
            return arr[index]
        }
        
        function randIn(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    })
})()

