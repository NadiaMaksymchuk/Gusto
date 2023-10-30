import multer from 'multer';

const storage = multer.memoryStorage();

const imageUpload = multer({
  storage: storage,
  // Limiting file size to 5MB
  limits: { fileSize: 5 * 1024 * 1024 },
  // Accepting only jpg, jpeg, and png files
  fileFilter: (req, file, cb) => {
    const fileRegex = new RegExp('\\.(jpg|jpeg|png)$');
    const fileName = file.originalname;

    if (!fileName.match(fileRegex)) {
      return cb(new Error('Invalid file type'));
    }

    cb(null, true);
  }
}).single('image'); 

export default imageUpload;
