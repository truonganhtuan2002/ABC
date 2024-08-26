const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Thiết lập kết nối cơ sở dữ liệu
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "sampledb"
});

db.connect((err) => {
    if (err) {
        console.error('Connection error: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Lấy tất cả người dùng
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Thêm người dùng mới
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, name, email });
    });
});

// Cập nhật thông tin người dùng
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(sql, [name, email, id], (err, result) => {
        if (err) throw err;
        res.json({ id, name, email });
    });
});

// Xóa người dùng
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'User deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
