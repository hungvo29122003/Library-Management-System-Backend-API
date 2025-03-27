-- Tạo database
CREATE DATABASE LibraryManagement;
USE LibraryManagement;

-- Bảng tài khoản
CREATE TABLE TaiKhoan (
   maTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
   tenDangNhap VARCHAR(255) NOT NULL,
   matKhau VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   vaiTro ENUM('QuanLy', 'ThuThu', 'DocGia') NOT NULL DEFAULT 'DocGia',
   trangThai ENUM('Active', 'Inactive') DEFAULT 'Active'
);

-- Bảng nhân sự
CREATE TABLE QuanLy (
    maQuanLy INT AUTO_INCREMENT PRIMARY KEY,
    maTaiKhoan INT UNIQUE,
    tenQuanLy VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,    
    cccd CHAR(12) UNIQUE NOT NULL,
    diaChi VARCHAR(255) CHARACTER SET UTF8MB4,
    sdt VARCHAR(15),
    email VARCHAR(255) UNIQUE NOT NULL,
    namSinh DATE,
    avatar VARCHAR(255),
    FOREIGN KEY (maTaiKhoan) REFERENCES TaiKhoan(maTaiKhoan) ON DELETE CASCADE
);

CREATE TABLE ThuThu (
    maThuThu INT AUTO_INCREMENT PRIMARY KEY,
    maTaiKhoan INT UNIQUE,
    tenThuThu VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    cccd CHAR(12) UNIQUE NOT NULL,
    diaChi VARCHAR(255) CHARACTER SET UTF8MB4,
    sdt VARCHAR(15),
    email VARCHAR(255) UNIQUE NOT NULL,
    namSinh DATE,
    avatar VARCHAR(255),
    FOREIGN KEY (maTaiKhoan) REFERENCES TaiKhoan(maTaiKhoan) ON DELETE CASCADE
);

CREATE TABLE DocGia (
    maDocGia INT AUTO_INCREMENT PRIMARY KEY,
    maTaiKhoan INT UNIQUE,
    tenDocGia VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    cccd CHAR(12) UNIQUE NOT NULL,
    namSinh DATE,
    sdt VARCHAR(15),
    email VARCHAR(255) UNIQUE NOT NULL,
    ngayGiaNhap DATE,
    avatar VARCHAR(255),
    lockAccount BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (maTaiKhoan) REFERENCES TaiKhoan(maTaiKhoan) ON DELETE CASCADE
);

-- Bảng danh mục sách
CREATE TABLE TheLoai (
    maTheLoai INT AUTO_INCREMENT PRIMARY KEY,
    tenTheLoai VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL
);

CREATE TABLE TrangThai (
    maTrangThai INT AUTO_INCREMENT PRIMARY KEY,
    tenTrangThai VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL
);

CREATE TABLE Khu (
    maKhu INT AUTO_INCREMENT PRIMARY KEY,
    tenKhu VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    moTa TEXT CHARACTER SET UTF8MB4
);

CREATE TABLE Sach (
    maSach INT AUTO_INCREMENT PRIMARY KEY,
    tenSach VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    tacGia VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    maTheLoai INT,
    ngayXuatBan DATE,
    maTrangThai INT,
    soLuong INT DEFAULT 1,
    maKhu INT,
    image VARCHAR(255),
    FOREIGN KEY (maTheLoai) REFERENCES TheLoai(maTheLoai) ON DELETE CASCADE,
    FOREIGN KEY (maTrangThai) REFERENCES TrangThai(maTrangThai) ON DELETE SET NULL,
    FOREIGN KEY (maKhu) REFERENCES Khu(maKhu) ON DELETE SET NULL
);

-- Bảng phiếu mượn/trả
CREATE TABLE PhieuMuon (
    maPhieu INT AUTO_INCREMENT PRIMARY KEY,
    maThuThu INT,
    maDocGia INT,
    ngayMuon DATE NOT NULL,
    FOREIGN KEY (maThuThu) REFERENCES ThuThu(maThuThu) ON DELETE CASCADE,
    FOREIGN KEY (maDocGia) REFERENCES DocGia(maDocGia) ON DELETE CASCADE
);

CREATE TABLE PhieuTra (
    maPhieu INT AUTO_INCREMENT PRIMARY KEY,
    maPhieuMuon INT UNIQUE,
    maThuThu INT,
    ngayTra DATE NOT NULL,
    tongTienPhat DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (maPhieuMuon) REFERENCES PhieuMuon(maPhieu) ON DELETE CASCADE,
    FOREIGN KEY (maThuThu) REFERENCES ThuThu(maThuThu) ON DELETE CASCADE
);

CREATE TABLE ChiTietPhieuMuon (
    maChiTiet INT AUTO_INCREMENT PRIMARY KEY,
    maPhieu INT,
    maSach INT,
    soLuong INT DEFAULT 1,
    FOREIGN KEY (maPhieu) REFERENCES PhieuMuon(maPhieu) ON DELETE CASCADE,
    FOREIGN KEY (maSach) REFERENCES Sach(maSach) ON DELETE CASCADE
);

CREATE TABLE ChiTietPhieuTra (
    maChiTiet INT AUTO_INCREMENT PRIMARY KEY,
    maPhieu INT,
    maSach INT,
    soLuong INT DEFAULT 1,
    trangThaiSach ENUM('BinhThuong', 'MatSach', 'Hong', 'TreHan') DEFAULT 'BinhThuong',
    phiPhat DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (maPhieu) REFERENCES PhieuTra(maPhieu) ON DELETE CASCADE,
    FOREIGN KEY (maSach) REFERENCES Sach(maSach) ON DELETE CASCADE
);

-- Bảng vi phạm
CREATE TABLE ViPham (
    maViPham INT AUTO_INCREMENT PRIMARY KEY,
    maDocGia INT,
    loaiViPham TEXT CHARACTER SET UTF8MB4 NOT NULL,
    ngayViPham DATE,
    FOREIGN KEY (maDocGia) REFERENCES DocGia(maDocGia) ON DELETE CASCADE
);

-- Bảng báo cáo thống kê
CREATE TABLE BaoCaoThongKe (
    maBaoCao INT AUTO_INCREMENT PRIMARY KEY,
    tenBaoCao VARCHAR(255) CHARACTER SET UTF8MB4 NOT NULL,
    maQuanLy INT,
    loaiBaoCao ENUM('SachMuon', 'SachTra', 'ViPham', 'DoanhThu', 'Khac') NOT NULL DEFAULT 'Khac',
    ngayBatDau DATE NOT NULL,
    ngayKetThuc DATE NOT NULL,
    soSachMuon INT DEFAULT 0,
    soSachTra INT DEFAULT 0,
    soSachHong INT DEFAULT 0,
    tongTienPhat DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (maQuanLy) REFERENCES QuanLy(maQuanLy) ON DELETE CASCADE
);

CREATE TABLE ChiTietBaoCao (
    maChiTiet INT AUTO_INCREMENT PRIMARY KEY,
    maBaoCao INT,
    maSach INT NULL,
    maDocGia INT NULL,
    maViPham INT NULL,
    soLuong INT DEFAULT 1,
    ghiChu TEXT CHARACTER SET UTF8MB4,
    FOREIGN KEY (maBaoCao) REFERENCES BaoCaoThongKe(maBaoCao) ON DELETE CASCADE,
    FOREIGN KEY (maSach) REFERENCES Sach(maSach) ON DELETE SET NULL,
    FOREIGN KEY (maDocGia) REFERENCES DocGia(maDocGia) ON DELETE SET NULL,
    FOREIGN KEY (maViPham) REFERENCES ViPham(maViPham) ON DELETE SET NULL
);
-- Thêm dữ liệu vào bảng TaiKhoan
INSERT INTO TaiKhoan (tenDangNhap, matKhau, email, vaiTro, trangThai) VALUES
('admin', 'admin123', 'admin@example.com', 'QuanLy', 'Active'),
('thuthu1', 'password123', 'thuthu1@example.com', 'ThuThu', 'Active'),
('docgia1', 'pass123', 'docgia1@example.com', 'DocGia', 'Active');

-- Thêm dữ liệu vào bảng QuanLy
INSERT INTO QuanLy (maTaiKhoan, tenQuanLy, cccd, diaChi, sdt, email, namSinh, avatar) VALUES
(1, 'Nguyen Van A', '123456789012', 'Ha Noi', '0987654321', 'admin@example.com', '1980-01-01', 'avatar1.png');

-- Thêm dữ liệu vào bảng ThuThu
INSERT INTO ThuThu (maTaiKhoan, tenThuThu, cccd, diaChi, sdt, email, namSinh, avatar) VALUES
(2, 'Tran Thi B', '234567890123', 'Ho Chi Minh', '0976543210', 'thuthu1@example.com', '1990-05-15', 'avatar2.png');

-- Thêm dữ liệu vào bảng DocGia
INSERT INTO DocGia (maTaiKhoan, tenDocGia, cccd, namSinh, sdt, email, ngayGiaNhap, avatar, lockAccount) VALUES
(3, 'Le Van C', '345678901234', '2000-08-22', '0965432109', 'docgia1@example.com', '2023-01-10', 'avatar3.png', FALSE);

-- Thêm dữ liệu vào bảng TheLoai
INSERT INTO TheLoai (tenTheLoai) VALUES
('Khoa học'),
('Văn học'),
('Kinh tế');

-- Thêm dữ liệu vào bảng TrangThai
INSERT INTO TrangThai (tenTrangThai) VALUES
('Có sẵn'),
('Đang mượn'),
('Hư hỏng');

-- Thêm dữ liệu vào bảng Khu
INSERT INTO Khu (tenKhu, moTa) VALUES
('Khu A', 'Khu vực sách khoa học'),
('Khu B', 'Khu vực sách văn học');

-- Thêm dữ liệu vào bảng Sach
INSERT INTO Sach (tenSach, tacGia, maTheLoai, ngayXuatBan, maTrangThai, soLuong, maKhu, image) VALUES
('Sách Khoa Học 1', 'Tác giả A', 1, '2010-05-10', 1, 5, 1, 'sach1.png'),
('Sách Văn Học 1', 'Tác giả B', 2, '2015-08-20', 1, 3, 2, 'sach2.png');

-- Thêm dữ liệu vào bảng PhieuMuon
INSERT INTO PhieuMuon (maThuThu, maDocGia, ngayMuon) VALUES
(1, 1, '2025-03-01');

-- Thêm dữ liệu vào bảng ChiTietPhieuMuon
INSERT INTO ChiTietPhieuMuon (maPhieu, maSach, soLuong) VALUES
(1, 1, 1),
(1, 2, 1);

-- Thêm dữ liệu vào bảng PhieuTra
INSERT INTO PhieuTra (maPhieuMuon, maThuThu, ngayTra, tongTienPhat) VALUES
(1, 1, '2025-03-10', 0);

-- Thêm dữ liệu vào bảng ChiTietPhieuTra
INSERT INTO ChiTietPhieuTra (maPhieu, maSach, soLuong, trangThaiSach, phiPhat) VALUES
(1, 1, 1, 'BinhThuong', 0),
(1, 2, 1, 'TreHan', 5000);

-- Thêm dữ liệu vào bảng ViPham
INSERT INTO ViPham (maDocGia, loaiViPham, ngayViPham) VALUES
(1, 'Trả sách trễ hạn', '2025-03-10');

-- Thêm dữ liệu vào bảng BaoCaoThongKe
INSERT INTO BaoCaoThongKe (tenBaoCao, maQuanLy, loaiBaoCao, ngayBatDau, ngayKetThuc, soSachMuon, soSachTra, soSachHong, tongTienPhat) VALUES
('Báo cáo tháng 3', 1, 'SachMuon', '2025-03-01', '2025-03-31', 2, 2, 0, 5000);

-- Thêm dữ liệu vào bảng ChiTietBaoCao
INSERT INTO ChiTietBaoCao (maBaoCao, maSach, maDocGia, maViPham, soLuong, ghiChu) VALUES
(1, 1, 1, 1, 1, 'Trả sách trễ hạn 5 ngày');
