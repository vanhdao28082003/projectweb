const Book = require('../../models/book.model')
const ApiError = require('../../helpers/api-error')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const upload = require('../../middlewares/admin/upload')
const path = require('path')
const fsx = require('fs-extra')

const createBook = async (req, res) => {
    try {
        const book = await Book.create({
            ...req.body,
            thumbnail: req.file ? req.file.filename : null
        })
        res.status(200).json({ message: 'Book added successfully', book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const book = await Book.find({})
        res.status(200).json(book);
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
}

const getOne = async (req, res) => {
  try {
      const bookId = req.params.id;
      if (!bookId) {
          return res.status(400).json({ message: 'Book ID is required' });
      }

      const book = await Book.findById(bookId);
      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }

      res.json(book);
  } catch (error) {
      console.error("Error in getOne:", error);  // Log lỗi chi tiết
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateOne = async (req, res) => {
  try {

    const bookId = req.params.id;
    const existingBook = await Book.findById(bookId);

    if (!existingBook) {
      return res.status(404).json({ message: `Cannot find book with ID: ${bookId}` });
    }

    // Check if a new image file is uploaded
    if (req.file) {
      // Remove the old image file
      if (existingBook.thumbnail) {
        const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', existingBook.thumbnail);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting old image file: ${err}`);
          } else {
            console.log(`Old image file deleted: ${existingBook.thumbnail}`);
          }
        });
      }
    }

    const data = {
      ...req.body,
      thumbnail: req.file ? req.file.filename : existingBook.thumbnail
    };
    const book = await Book.findByIdAndUpdate(bookId, data, { new: true })
    if (!book) {
      res.status(404).json({ message: `Can not find book with ID: ${req.params.id}` })
    }
    res.status(200).json({ message: "Book was updated" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message)
  }
}

const deleteOne = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id, req.body)
        if (!book) {
            return res.status(404).json({ message: `Cannot find book with ID: ${req.params.id}` });
        }

        if (book.thumbnail) {
            const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', book.thumbnail);
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(`Error deleting image file: ${err}`);
              } else {
                console.log(`Image file deleted: ${book.thumbnail}`);
              }
            });
        }
        res.status(200).json({ message: `Book with ID: ${req.params.id} was deleted` });
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
}

const deleteAll = async (req, res) => {
    try {
        const result = await Book.deleteMany({})

        // Đường dẫn đến thư mục 'uploads'
        const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');

        // xóa thư mục uploads đệ quy
        await fsx.emptyDir(uploadDir)
        res.status(200).json({ message: `Deleted ${result.deletedCount} books.` });
    } catch (error) {
        res.status(500);
        throw new Error(error.message)
    }
}

module.exports = {
    createBook,
    getAll,
    getOne,
    updateOne,
    deleteOne,
    deleteAll
}