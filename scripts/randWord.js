const fs = require('fs');
const TRIALS = 10000000
const LETTERS = 8
fs.readFile('c:/wordrush/data/valid-words.txt', (err, data) => {
	words = String(data).toLowerCase().split(',')
	let goodWords = []
	let correct = 0.
	for (var i = 0; i < TRIALS; i++) {
		let guess = ''
		for(let a = 0; a < LETTERS; a++) {
			guess += String.fromCharCode(Math.floor(Math.random() * (91-65) + 65))
		}
		//console.log(guess)
		if(isWord(guess,words)) {
			correct++
			goodWords.push(guess)
		}
	}

	console.log('Chance of random ' + LETTERS + '-letter phrase being a word: ' + (correct*100/TRIALS) + '%')
	for(let u of goodWords) {
		console.log(u);
	}
})

function isWord(element,arr) {
	element = element.toLowerCase()
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
