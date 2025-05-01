import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure temp folder exists
const tempDir = path.join(process.cwd(), "public", "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

export default upload;
