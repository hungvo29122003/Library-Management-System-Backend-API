const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = 3000 || process.env.PORT;
const app = express();
app.use(cors());
const auth = require('./src/utils/auth');
const morgan = require('morgan');
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', './src/views');


app.use(function (req, res, next) {
    // console.log('Time:', Date.now());
    // console.log('Request Type:', req.method);
    // console.log('Request URL', req.originalUrl);
    const token = req.cookies.accessToken;
    const checkUser = auth.verifyAccsessToken(token);
    if (checkUser) {
        res.locals.user = checkUser;
    }
    next();
});


app.use(express.static(path.join(__dirname, 'public')));

const authRouter = require('./src/routes/authRoute');
const phieuMuonRouter = require('./src/routes/phieuMuonRoute');
const bookRouter = require('./src/routes/bookRoute');
const phieuTraRouter = require('./src/routes/phieuTraRoute');
const categoryRouter = require('./src/routes/categoryRoute');
const docGiaRouter = require('./src/routes/docGiaRoute')
const quanLyRouter = require('./src/routes/quanLyRoute')
const thuThuRouter = require('./src/routes/thuThuRoute')
const zoneRouter = require('./src/routes/zonesRoute')
app.use('/thuThu', thuThuRouter);
app.use('/quanLy', quanLyRouter);
app.use('/docGia', docGiaRouter);
app.use('/phieuTra', phieuTraRouter);
app.use('/auth', authRouter);
app.use('/phieuMuon', phieuMuonRouter);
app.use('/book', bookRouter);
app.use('/category', categoryRouter);
app.use('/khu', zoneRouter);
app.use('/uploads', express.static('uploads'));
// const employeeRouter = require('./src/routes/employeeRoute');
// app.use('/employees', employeeRouter);

// const productRouter = require('./src/routes/productRoute');
// app.use('/products', productRouter);


app.get('/', (req, res) => {
    return res.render('index');
});

app.get('/about', (req, res) => {
    res.render('info/about');
});

// Middleware xử lý lỗi 404: Khi không có route nào khớp
app.use((req, res, next) => {
    console.log('404 middleware hit');
    res.status(404).render('error404');
  });

// app.listen(port, () => {
//     console.log(`App listening at http://localhost:${port}`);
// });
// const PORT = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});