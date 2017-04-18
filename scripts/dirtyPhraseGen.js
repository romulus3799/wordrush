const fs = require('fs')

fs.readFile('c:/wordrush/data/letters.txt', (err, data) => {
    var letters = String(data).split(',')
    var dirtyPhrases = ''

    //generate every possible one or two-letter phrase
    for(let a = 0; a < letters.length; a++) {
        dirtyPhrases += letters[a] + ','
        for(let b = 0; b < letters.length; b++) {
            dirtyPhrases += letters[a] + letters[b] + ','
			for(let c = 0; c < letters.length; c++) {
	            dirtyPhrases += letters[a] + letters[b] + letters[c] + ','
	        }
        }
    }

    //format and write to text file
    while(dirtyPhrases.endsWith(',')) {
        dirtyPhrases = dirtyPhrases.substring(0, dirtyPhrases.length-1)
    }
    fs.writeFileSync('c:/wordrush/data/dirty-phrases.txt', dirtyPhrases)
})
