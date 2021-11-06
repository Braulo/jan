'use strict'

const express = require('express')
const Busboy = require('busboy')
const process = require('process')
const fs = require('fs/promises')
const FS = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 80
const STORAGE_PATH = process.env.STORAGE_PATH || './storage'

const app = express()

app.get('/:id', (req, res, next) => {
    fs.readdir(path.join(STORAGE_PATH, req.params.id))
        .then(files => {
            if(files.includes('.filename')) return fs.readFile(path.join(STORAGE_PATH, req.params.id, '.filename'), 'utf8')
            else return Promise.reject(new Error('metadata missing'))
        })
        .then(filename => FS.createReadStream(path.join(STORAGE_PATH, req.params.id, filename)))
        .then(file => file.pipe(res))
        .catch(next)
})

app.post('/', (req, res, next) => {    
    var busboy = new Busboy({ headers: req.headers })
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        const id = uuidv4()

        if(filename.startsWith('.')) filename = filename.replace(/^\.+/g, '')

        if(!busboy.files) busboy.files = []
        busboy.files.push(
            fs.stat(STORAGE_PATH)
                .catch(e => fs.mkdir(STORAGE_PATH))
                .then(() => fs.mkdir(path.join(STORAGE_PATH, id)))
                .then(() => new Promise((resolve, reject) => {
                    file.pipe(FS.createWriteStream(path.join(STORAGE_PATH, id, filename)))
                    file.on('end', () => fs.writeFile(path.join(STORAGE_PATH, id, '.filename'), filename).then(_ => resolve(id)).catch(e => reject(e)))
                    file.on('error', (e) => reject(e))
                }))
            )
    })

    busboy.on('finish', function() {
        Promise.all(busboy.files)
            .then(ids => res.json({ status: true, result: ids }))
            .catch(next)
    })

    req.pipe(busboy)

})

/* Error Handler */
app.use((err, req, res, next) => res.status(500).json({ success: false, error: err.name, message: err.message }))

app.listen(PORT, () => console.log('[Image Server] Listening on http://localhost:' + PORT))