const fs = require('fs')

fs.readFile('../data/letters.txt', (err, data) => {
    var letters = String(data).split(',')
    var dirtyPhrases = ''
    
    //generate every possible one or two-letter phrase
    for(let a = 0; a < letters.length; a++) {
        dirtyPhrases += letters[a] + ','
        for(let b = 0; b < letters.length; b++) {
            dirtyPhrases += letters[a] + letters[b] + ','
        }
    }
    
    //format and write to text file
    while(dirtyPhrases.endsWith(',')) {
        dirtyPhrases = dirtyPhrases.substring(0, dirtyPhrases.length-1)
    }
    fs.writeFileSync('../data/dirty-phrases.txt', dirtyPhrases)
})