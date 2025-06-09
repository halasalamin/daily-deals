// import multer from "multer";

// const storage = multer.diskStorage({
//     filename: function (req, file, callback) {
//         callback(null, file.originalname)
//     }
// })

// const upload = multer({ storage })

// export default upload

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
            return callback(new Error('Only image files are allowed.'));
        }
        callback(null, true);
    }
});

export default upload;

