import multer from 'multer'

/**
 * Multer Storage Configuration
 * Configures file upload settings for handling image uploads
 * Preserves original filenames when storing files
 */
const storage = multer.diskStorage({
  /**
   * Determines the filename for uploaded files
   * Uses the original filename without modification
   *
   * @param {Object} req - Express request object
   * @param {Object} file - File object containing file details
   * @param {Function} callback - Callback to set filename
   */
  filename: function (req, file, callback) {
    callback(null, file.originalname)
  },
})

/**
 * Multer Upload Middleware
 * Creates configured multer instance with defined storage
 * Handles multipart/form-data file uploads
 */
const upload = multer({ storage: storage })

export default upload
