```
# Library Management System - Backend API 📚

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

API Backend cho hệ thống quản lý thư viện, hỗ trợ các chức năng quản lý sách, thành viên, mượn trả, và người dùng. Hệ thống được xây dựng để cung cấp các dịch vụ RESTful cho ứng dụng di động (Android) và các client khác.

## 🚀 Tính năng chính

-   **Quản lý người dùng:** Đăng ký, đăng nhập, quản lý vai trò (Admin, User).
-   **Quản lý sách:** Thêm, sửa, xóa, tìm kiếm sách.
-   **Quản lý thành viên:** Thêm, sửa, xóa, tìm kiếm thông tin thành viên.
-   **Quản lý mượn trả:** Ghi nhận và theo dõi các giao dịch mượn/trả sách.
-   **Tích hợp xác thực:** Sử dụng JSON Web Tokens (JWT) để bảo mật API.
-   **Tương tác cơ sở dữ liệu:** Lưu trữ và truy xuất dữ liệu từ MySQL.
-   **API RESTful:** Cung cấp các điểm cuối API chuẩn mực để client dễ dàng tương tác.
-   **Upload ảnh:** Hỗ trợ upload và quản lý ảnh (ví dụ: ảnh bìa sách, ảnh đại diện).

## 💻 Công nghệ sử dụng

-   **Backend:** Node.js, Express.js
-   **Cơ sở dữ liệu:** MySQL
-   **Xác thực:** JSON Web Tokens (JWT)
-   **Quản lý file:** Multer (để xử lý upload ảnh)
-   **Mã hóa mật khẩu:** Bcrypt

## ⚙️ Hướng dẫn cài đặt và chạy dự án

Để chạy project backend này trên máy cục bộ của bạn, làm theo các bước sau:

### 1. Yêu cầu (Prerequisites)

Đảm bảo bạn đã cài đặt các công cụ sau:

-   [Node.js](https://nodejs.org/) (phiên bản khuyến nghị: 14.x trở lên)
-   [npm](https://www.npmjs.com/) (thường đi kèm với Node.js)
-   [MySQL Server](https://www.mysql.com/downloads/mysql/)

### 2. Cấu hình cơ sở dữ liệu

a. **Tạo database:**
   Tạo một database mới trong MySQL của bạn, ví dụ: `library_management_system`.

b. **Import schema:**
   Import file `LibraryManagement.sql` vào database vừa tạo. File này chứa cấu trúc bảng và dữ liệu mẫu.

### 3. Cài đặt dependencies

Clone repository về máy của bạn và cài đặt các gói phụ thuộc:
git clone https://github.com/hungvo29122003/Library-Management-System-Backend-API.git
cd Library-Management-System-Backend-API
npm install


### 4. Cấu hình biến môi trường

Tạo một file `.env` trong thư mục gốc của dự án và thêm các thông tin sau:

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=library_management_system
JWT_SECRET=your_secret_key_for_jwt # Thay thế bằng một chuỗi ngẫu nhiên mạnh
PORT=3000 # Hoặc một cổng khác nếu muốn
*Thay thế `your_mysql_username` và `your_mysql_password` bằng thông tin đăng nhập MySQL của bạn.*

### 5. Khởi chạy ứng dụng
Bằng câu lệnh npm start hoặc npm run dev vì đã được cấu hình nodemon trong package.json rồi 



```
