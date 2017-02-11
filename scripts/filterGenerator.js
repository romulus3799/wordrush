const fs = require('fs')
const jsonfile = require('jsonfile')
var phrases = []
var output = {}
var cutoff = 1000

//read and store possible phrases
fs.readFile('../data/phrases.txt', (err, data) => {
    if (err) {
        throw err;
    }
    
    //create JSON with occurences for each phrase
    phrases = String(data).split(',')
    for(let i = 0; i < phrases.length; i++) {
        output[phrases[i]] = 0
    }
    
    //for each phrase, count words that start with phrase
    fs.readFile('../data/valid-words.txt', (err, data) => {
        words = String(data).split(',')
        for(let i = 0; i < phrases.length; i++) {
            console.log('Processing ' + phrases[i])
            for(let a = 0; a < words.length; a++) {
                if(words[a].startsWith(phrases[i])) {
                    output[phrases[i]]++
                }
            }
        }
        
        //write phrase occurence data
        jsonfile.writeFileSync('../data/phrase-data.json', output, null, 4)
        
        //store good phrases as phrases with at least 1000 words
        var goodPhrases = ''
        for(let i = 0; i < phrases.length; i++) {
            if(output[phrases[i]] >= cutoff) {
                goodPhrases += phrases[i] + ','
            }
        }
        
        //format and write good phrases to text file
        while(goodPhrases.endsWith(',')) {
            goodPhrases = goodPhrases.substring(0, goodPhrases.length-1)
        }
        fs.writeFileSync('../data/valid-phrases.txt', goodPhrases)
    })
})