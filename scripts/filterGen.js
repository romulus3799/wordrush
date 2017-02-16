const fs = require('fs')
const jsonfile = require('jsonfile')

function generateFilter(inData, outData, filtData, cond) {
    var phrases = []
    var output = {}
    var cutoff = (cond === 'endsWith') ? 800 : (cond == 'includes') ? 10000 : 1000
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
                        //count word if it contains phrase
                    if(cond === 'includes') {
                        if(words[a].includes(phrases[i])) {
                            output[phrases[i]]++
                        }
                        //count word if it starts with phrase
                    } else if(cond === 'startsWith') {
                        if(words[a].startsWith(phrases[i])) {
                            output[phrases[i]]++
                        }
                        //count word if it ends with phrase
                    } else if(cond === 'endsWith') {
                        if(words[a].endsWith(phrases[i])) {
                            output[phrases[i]]++
                        }
                        //count word if the phrase caps it
                    } else if(cond === 'both') {
                        //check if phrase is > 1 letter, does not end with an 's', and does not contain 'u' or 'y'
                        if(phrases[i].length > 1 
                           && !phrases[i].endsWith('s') 
                           && !phrases[i].includes('u') 
                           && !phrases[i].endsWith('y')) {
                            
                            var st = phrases[i].charAt(0)
                            var en = phrases[i].charAt(1)
                            if(words[a].startsWith(st) && words[a].endsWith(en)) {
                                output[phrases[i]]++
                            }
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

generateFilter('../data/clean-phrases.txt', 
               '../data/start-phrase-data.json', 
               '../data/valid-start-phrases.txt',
               'startsWith')

generateFilter('../data/dirty-phrases.txt', 
               '../data/in-phrase-data.json', 
               '../data/valid-in-phrases.txt', 
               'includes')

generateFilter('../data/dirty-phrases.txt', 
               '../data/end-phrase-data.json', 
               '../data/valid-end-phrases.txt', 
               'endsWith')

generateFilter('../data/dirty-phrases.txt', 
               '../data/cap-phrase-data.json', 
               '../data/valid-cap-phrases.txt', 
               'both')