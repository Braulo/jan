const fs = require('fs')
const path = require('path')

module.exports = [
    fs.readFileSync(path.join(__dirname, 'family.sql'), 'utf8'),  
    fs.readFileSync(path.join(__dirname, 'familymembers.sql'), 'utf8'),
    fs.readFileSync(path.join(__dirname, 'listitem.sql'), 'utf8'),   
    fs.readFileSync(path.join(__dirname, 'shoppinglist.sql'), 'utf8')   
]