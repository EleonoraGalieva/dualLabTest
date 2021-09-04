const multer = require('multer')

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.jpg$/)) {
            cb(new Error('Only jpg files accepted.'))
        }
        cb(undefined, true)
    }
})

module.exports = upload