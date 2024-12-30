const mongoose = require("mongoose");

const documentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      default: "root",
    },
    tags: {
      type: [String],
      default: [],
    },
    metadata: {
      fileSize: { type: Number},
      uploadDate: {type: Date, default: Date.now},
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;
