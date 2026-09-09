const stream = require("stream");
const cloudinary = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// POST /media/upload (protected, multipart/form-data with "image" field)
const uploadMedia = asyncHandler(async (req, res) => {
if (!req.file) throw new ApiError(400, "VALIDATION_ERROR", "No image file provided");
// Remove the field name mention or change to 'file'
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new ApiError(
      500,
      "STORAGE_NOT_CONFIGURED",
      "Cloudinary credentials are not configured on the server"
    );
  }

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "sayftechnology" },
      (error, uploadResult) => {
        if (error) return reject(error);
        resolve(uploadResult);
      }
    );
    stream.Readable.from(req.file.buffer).pipe(uploadStream);
  });

  res.status(201).json({ url: result.secure_url, public_id: result.public_id });
});

module.exports = { uploadMedia };
