const Reader = require('../../models/reader.model')
const Book = require('../../models/book.model')
const asyncHandler = require('express-async-handler')
const generateString = require('../../helpers/generateString')

const create = asyncHandler(async (req, res) => {
    try {
      req.body.email = req.body.email.toLowerCase(); // Chuyển email thành chữ thường
      req.body.token = generateString.generateRandomString(20);
      const user = await Reader.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        let message = "Duplicate field error";
        if (duplicateField === "email") {
          message = "Email already exists";
          }
          if (duplicateField === "phone") {
            message = "Phone already exists";
          }
        return res.status(400).json({ error: message });
      }
      res.status(500).json({ message: `Error! ${error.message}` });
    }
  });
  


const getUser = asyncHandler(async (req, res) => {
    try {
        // Kiểm tra xem header Authorization có tồn tại hay không
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            return res.status(400).json({ message: "Authorization token missing or malformed" });
        }

        // Tách token từ header Authorization
        const tokenUser = req.headers.authorization.split(" ")[1];
        
        // Tìm người dùng với token
        const reader = await Reader.findOne({ token: tokenUser });

        if (!reader) {
            return res.status(404).json({ message: "Reader not found" });
        }

        res.status(200).json({ message: "Send reader successfully.", reader });
    } catch (error) {
        res.status(500).json({ message: `Error! ${error}` });
    }
});


const getAll = async (req, res) => {
    try {
        const reader = await Reader.find({});
        res.status(200).json(reader);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const borrowBook = async (req, res) => {
    try {
        const tokenUser = req.cookies.tokenUser;
        if (tokenUser) {
            const reader = await Reader.findOne({ token: tokenUser });

            if (!reader) {
                return res.status(404).json({ message: 'Reader not found' });
            }

            if (!Array.isArray(reader.borrow)) {
                reader.borrow = [];
            }

            const newBorrow = {
                id_book: req.body.borrow.id_book,
                status: req.body.borrow.status || "processing",
                borrowDate: req.body.borrow.borrowDate || "01/01/2024",
                returnDate: req.body.borrow.returnDate || "31/12/2024",
                quantity: req.body.borrow.quantity || 1,
                initialQuantity: req.body.borrow.quantity || 1,
            };

            const readers = await Reader.find({});
            let borrowedBookQuantity = 0;

            readers.forEach(function (reader) {
                reader.borrow.forEach(function (borrow) {
                    if (borrow.id_book === req.body.borrow.id_book) {
                        borrowedBookQuantity += borrow.quantity;
                    }
                });
            });

            const book = await Book.findById(req.body.borrow.id_book);
            if (!book) {
                // Kiểm tra xem sách có tồn tại hay không
                return res.status(404).json({ message: 'Book not found' });
            }

            if (book.quantity === 0) {
                // Không còn sách trong kho
                console.log("Không còn sách trong kho để mượn");
                return res.status(400).json({ message: "Không còn sách trong kho để mượn" });
            } else if (book.quantity - borrowedBookQuantity - newBorrow.quantity < 0) {
                // Số lượng sách đã được mượn bằng hoặc vượt quá số lượng sách trong kho
                console.log("Số lượng sách đã mượn đã đạt tới giới hạn");
                return res.status(400).json({ message: "Số lượng sách đã mượn đã đạt tới giới hạn" });
            }

            // Kiểm tra xem đã có quyển sách trong mảng borrow chưa
            const existingBook = reader.borrow.find(book => book.id_book === newBorrow.id_book);

            if (existingBook)  {
                if (existingBook.status === "accepted") {
                    // Nếu trạng thái là "đã duyệt", không cho phép mượn thêm
                    return res.status(400).json({ message: 'Sách bạn mượn đã duyệt nhưng chưa trả' });
                } else if(existingBook.status === "processing") {
                    // Nếu đã có quyển sách nhưng chưa được duyệt, cập nhật số lượng
                    return res.status(400).json({ message: 'Sách bạn mượn đang đợi duyệt' });
                } else if(existingBook.status === "returned" || existingBook.status === "refused" ) {
                    // Nếu sách đã trả, cho phép mượn lại
                    existingBook.status = "processing"
                    existingBook.quantity += newBorrow.quantity;
                    existingBook.borrowDate = newBorrow.borrowDate || '01/01/2024';
                    existingBook.returnDate = newBorrow.returnDate || '31/12/2024';
                }
            } else {
                // Nếu chưa có quyển sách trong mảng borrow, thêm borrow vào mảng
                reader.borrow.push(newBorrow);
            }

            // Lưu lại thay đổi vào cơ sở dữ liệu
            await reader.save();

            res.status(200).json({ message: 'Cập nhật mượn sách thành công', reader });
        }
    } catch (error) {
        console.error('Cập nhật mượn sách thất bại:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const deleteBookFromBorrow = asyncHandler(async (req, res) => {
    try {
        const tokenUser = req.cookies.tokenUser;
        const id = req.params.id;

        if (tokenUser) {
            const reader = await Reader.findOne({
                token: tokenUser,
            })

            if (reader) {
                // Lọc ra các danh sách trong borrow mà id_book không bằng id cần xóa
                reader.borrow = reader.borrow.filter(book => book.id_book !== id)

                // Lưu thay đổi vào CSDL
                await reader.save()
                res.status(200).json({message:"Book deleted successfully."})
            } else {
                res.status(404).json({message: "Reader not found."})
            }
        } else {
            res.status(401).json({message: "Unauthorized."})
        }
    } catch (error) {
        res.status(500).json({ message: `Error! ${error}` });
    }
})

const statusBookReturn = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { readerId, bookId } = req.params
        const { status } = req.body

        // Kiểm tra xem reader và book có tồn tại không
        const reader = await Reader.findById(readerId)
        if (!reader) {
            res.status(404).json({ message: "Reader not found." })
            return;
        }

        const bookIndex = reader.borrow.findIndex(book => book.id_book === bookId)
        if (bookIndex === -1) {
            res.status(404).json({ message: "Book not found." })
            return;
        }

        console.log("bookIndex", bookIndex)

        // Thay đổi trạng thái sách
        reader.borrow[bookIndex].status = status

        // Nếu trạng thái là "đã trả", giảm quantity đi 1
        if (status === "returned" || status === "refused") {
            // Giảm quantity đi 1, nhưng không thay đổi initialQuantity
            reader.borrow[bookIndex].quantity -= 1;
        }

        // Lưu thay đổi vào CSDL
        await reader.save()

        // Trả về thông báo thành công
        res.status(200).json({ message: "Status updated successfully." })
    } catch (error) {
        res.status(500).json({ message: `Error! ${error}` })
    }
}


const getNumberBookBorrowed = asyncHandler(async (req,res) => {
    try {
        const readers = await Reader.find({})
        let borrowedBookQuantity = 0

        readers.forEach(function (reader) {
            reader.borrow.forEach(function (borrow) {
                if (borrow.id_book === req.params.id_book) {
                    borrowedBookQuantity += borrow.quantity
                }
            })
        })

        res.status(200).json({message: 'Send NumberBookBorrowed successfully',borrowedBookQuantity})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { token } = req.params; // Lấy token từ URL
    const { fullName, email, phone, address } = req.body; // Lấy thông tin cần cập nhật từ body request
    
    // Kiểm tra xem token có hợp lệ không (ví dụ, kiểm tra token trong cơ sở dữ liệu)
    const user = await Reader.findOne({ token }); // Tìm người dùng dựa trên token

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra email đã tồn tại chưa (ngoại trừ email của người dùng hiện tại)
    if (email) {
        const emailExists = await Reader.findOne({ email, _id: { $ne: user._id } }); // Tìm người dùng khác có email này
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        user.email = email; // Cập nhật email nếu không có vấn đề
    }

    // Kiểm tra số điện thoại đã tồn tại chưa (ngoại trừ số điện thoại của người dùng hiện tại)
    if (phone) {
        const phoneExists = await Reader.findOne({ phone, _id: { $ne: user._id } }); // Tìm người dùng khác có số điện thoại này
        if (phoneExists) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }
        user.phone = phone; // Cập nhật số điện thoại nếu không có vấn đề
    }

    // Cập nhật các thông tin khác (nếu có)
    if (fullName) user.fullName = fullName;
    if (address) user.address = address;

    // Lưu thay đổi vào cơ sở dữ liệu
    await user.save();
  
    // Trả về phản hồi thành công
    res.status(200).json({
      message: 'User updated successfully',
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        // Bạn có thể trả thêm các thông tin khác nếu cần
      }
    });
});


const getInforUserByToken = asyncHandler(async (req, res) => {
    try {
        // Kiểm tra xem header Authorization có tồn tại hay không
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            return res.status(400).json({ message: "Authorization token missing or malformed" });
        }

        // Tách token từ header Authorization
        const tokenUser = req.headers.authorization.split(" ")[1];
        
        // Tìm người dùng với token
        const reader = await Reader.findOne({ token: tokenUser });

        if (!reader) {
            return res.status(404).json({ message: "Reader not found" });
        }

        res.status(200).json({ message: "Send reader successfully.", reader });
    } catch (error) {
        res.status(500).json({ message: `Error! ${error}` });
    }
});

module.exports = {
    create,
    getUser,
    getAll,
    deleteBookFromBorrow,
    borrowBook,
    statusBookReturn,
    getNumberBookBorrowed,
    updateUser,
    getInforUserByToken,
}
