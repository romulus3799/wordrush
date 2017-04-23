const fs = require('fs')
const jsonfile = require('jsonfile')

function generateFilter(inData, outData, filtData, cond) {
    var phrases = []
	var easyPhrases = []
    var output = {}
    const MIN_TIES = (cond === 'includes') ? 4000 :
				  						 	 1000
	const MAX_TIES = (cond === 'endsWith') ? 5000 :
				 	 (cond === 'includes') ? 8000 :
				  						 	 4000
	//read and store possible phrases
    fs.readFile(inData, (err, data) => {
        if (err) {
            throw err;
        }

		fs.readFile('c:/wordrush/data/easy-end-phrases.txt', (err, data) => {
			easyPhrases = String(data).toLowerCase().split(',')
			console.log(easyPhrases)
		})

        //create JSON with occurences for each phrase
        phrases = String(data).toLowerCase().split(',')
        for(let i = 0; i < phrases.length; i++) {
            output[phrases[i]] = 0
        }

        //for each phrase, count words that start with or include phrase
        fs.readFile('c:/wordrush/data/valid-words.txt', (err, data) => {


            words = String(data).toLowerCase().split(',')
			//iterate over each phrase
			for(let i = 0; i < phrases.length; i++) {
				//if condition is endswith, jump over easy conditions

				if (cond === 'endsWith' && isIn(phrases[i],easyPhrases)) {
					//console.log('Skipping ' + phrases[i])
					continue;
				}

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
					} else if(cond === 'both12') {
                        //check if phrase is > 1 letter, does not end with an 's', and does not contain 'u' or 'y'
                        if(phrases[i].length > 1
                           	&& !phrases[i].endsWith('s')
                           	&& !phrases[i].includes('u')
                           	&& !phrases[i].endsWith('y')) {

                            var st = phrases[i].charAt(0)
                            var en = phrases[i].substring(1)
                            if(words[a].startsWith(st) && words[a].endsWith(en)) {
                                output[phrases[i]]++
                            }
                        }
                    } else if(cond === 'both21') {
                        //check if phrase is > 1 letter, does not end with an 's', and does not contain 'u' or 'y'
                        if(phrases[i].length > 1
                           	&& !phrases[i].endsWith('s')
                           	&& !phrases[i].includes('u')
                           	&& !phrases[i].endsWith('y')) {

                            var st = phrases[i].substring(0,2)
                            var en = phrases[i].charAt(2)
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
                if(output[phrases[i]] >= MIN_TIES && output[phrases[i]] <= MAX_TIES) {
                    goodPhrases += phrases[i] + ','
                }
            }

            //format and write good phrases to text file
            while(goodPhrases.endsWith(',')) {
                goodPhrases = goodPhrases.substring(0, goodPhrases.length-1)
            }
            fs.writeFileSync(filtData, goodPhrases)
			console.log('Wrote to ' + filtData)
        })
    })
}

function isIn(e,arr) {
	for(let i = 0; i < arr.length; i++) {
		if(arr[i] === e) {
			return true
		}
	}
	return false
}
// generateFilter('c:/wordrush/data/dirty-phrases.txt',
//                'c:/wordrush/data/start-phrase-data.json',
//                'c:/wordrush/data/valid-start-phrases.txt',
//                'startsWith')

generateFilter('c:/wordrush/data/dirty-phrases.txt',
               'c:/wordrush/data/in-phrase-data.json',
               'c:/wordrush/data/valid-in-phrases.txt',
               'includes')
//
// generateFilter('c:/wordrush/data/dirty-phrases.txt',
//                'c:/wordrush/data/end-phrase-data.json',
//                'c:/wordrush/data/valid-end-phrases.txt',
//                'endsWith')
//
// generateFilter('c:/wordrush/data/dirty-phrases.txt',
//                'c:/wordrush/data/cap12-phrase-data.json',
//                'c:/wordrush/data/valid-cap12-phrases.txt',
//                'both12')
//
// generateFilter('c:/wordrush/data/dirty-phrases.txt',
//               'c:/wordrush/data/cap21-phrase-data.json',
//               'c:/wordrush/data/valid-cap21-phrases.txt',
//               'both21')
