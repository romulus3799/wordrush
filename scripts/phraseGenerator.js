fs = require('fs')

consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z']
vowels = ['a','e','i','o','u']
phrases = ''

//add all vowels
for(let a = 0; a < vowels.length; a++) {
    phrases += vowels[a] + ','
}

//add all consonants
for(let a = 0; a < consonants.length; a++) {
    phrases += consonants[a] + ','
}

//add all combinations of vowel + consonant
for(let a = 0; a < vowels.length; a++) {
    for(let b = 0; b < consonants.length; b++) {
        phrases += vowels[a] + consonants[b] + ','
    }
}

//add all combinations of consonant + vowel
for(let a = 0; a < consonants.length; a++) {
    for(let b = 0; b < vowels.length; b++) {
        phrases += consonants[a] + vowels[b] + ','
    }
}

//format and write to text file
while(phrases.endsWith(',')) {
    phrases = phrases.substring(0, phrases.length-1)
}
fs.writeFile('../data/phrases.txt', phrases)