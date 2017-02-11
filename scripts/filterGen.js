const fs = require('fs')
const jsonfile = require('jsonfile')

function generateFilter(inData, outData, filtData, complex) {
    var phrases = []
    var output = {}
    var cutoff = complex ? 10000 : 1000
//read and store possible phrases
    fs.readFile(inData, (err, data) => {
        if (err) {
            throw err;
        }

        //create JSON with occurences for each phrase
        phrases = String(data).toLowerCase().split(',')
        for(let i = 0; i < phrases.length; i++) {
            output[phrases[i]] = 0
        }

        //for each phrase, count words that start with or include phrase
        fs.readFile('../data/valid-words.txt', (err, data) => {
            words = String(data).toLowerCase().split(',')
            for(let i = 0; i < phrases.length; i++) {
                console.log('Processing ' + phrases[i])
                for(let a = 0; a < words.length; a++) {
                    if(complex) {
                        if(words[a].includes(phrases[i])) {
                            output[phrases[i]]++
                        }
                    } else {
                        if(words[a].startsWith(phrases[i])) {
                            output[phrases[i]]++
                        }
                    }
                }
            }

            //write phrase occurence data
            jsonfile.writeFileSync(outData, output, null, 4)

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
            fs.writeFileSync(filtData, goodPhrases)
        })
    })
}

generateFilter('../data/phrases.txt', 
               '../data/phrase-data.json', 
               '../data/valid-phrases.txt',
               false)

generateFilter('../data/dirty-phrases.txt', 
               '../data/dirty-phrase-data.json', 
               '../data/valid-dirty-phrases.txt', 
               true)