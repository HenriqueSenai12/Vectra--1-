const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vectra_db'
});

db.connect((err) => {
  if (err) {
    console.error('Erro conectar DB:', err);
    return;
  }
  console.log('✅ MySQL conectado (XAMPP)');
});

const app = express();
const PORT = 3300;

// XAMPP MySQL config (local, porta 3306 default)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // default XAMPP
  database: 'vectra_db' // create in phpMyAdmin
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '')));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/backend', express.static(path.join(__dirname, 'backend')));

// Serve index.html as root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API login - check email/senha XAMPP MySQL
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT id, nome_completo, funcao FROM usuarios WHERE email = ? AND senha = ?',
      [email, senha]
    );
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }
  } catch (err) {
    console.error('Login DB Error:', err);
    res.status(500).json({ success: false, error: 'Erro servidor' });
  } finally {
    if (connection) connection.end();
  }
});

// API users CRUD
app.get('/api/users', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT id, nome_completo as name, email, funcao as role, senha FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'XAMPP DB error' });
  } finally {
    if (connection) connection.end();
  }
});

app.post('/api/users', (req, res) => {
  const { nome_completo, email, funcao, senha } = req.body;

  const sql = "INSERT INTO usuarios (nome_completo, email, funcao, senha) VALUES (?, ?, ?, ?)";
  db.query(sql, [nome_completo, email, funcao, senha], (erro, resultados) => {
    if (erro) {
      console.error('Create error:', erro);
      return res.status(500).json({ error: "Erro no banco de dados." });
    }
    res.json({ success: true, message: "Usuário criado com sucesso!" });
  });
});

app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const { nome_completo, funcao, senha } = req.body;

  let sql = "UPDATE usuarios SET nome_completo = ?, funcao = ?";
  let params = [nome_completo, funcao];
  if (senha) {
    sql += ", senha = ?";
    params.push(senha);
  }
  sql += " WHERE id = ?";
  params.push(id);

  db.query(sql, params, (erro, resultados) => {
    if (erro) {
      console.error('Update error:', erro);
      return res.status(500).json({ error: "Erro no banco de dados." });
    }
    res.json({ success: true, message: "Usuário atualizado com sucesso!" });
  });
});

app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id; // Pega o ID que veio na URL

  const sql = "DELETE FROM usuarios WHERE id = ?";

  db.query(sql, [id], (erro, resultados) => {
    if (erro) {
      console.error('Delete error:', erro);
      return res.status(500).json({ error: "Erro no banco de dados." });
    }
    res.json({ success: true, message: "Excluído com sucesso!" });
  });
});

// Health
app.get('/health', (req, res) => res.json({ status: 'OK', xampp: true }));

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Vectra Server + XAMPP: http://localhost:${PORT}`);
  console.log(`📱 Site: http://localhost:${PORT}/`);
  console.log(`📊 API MySQL: http://localhost:${PORT}/api/users`);
console.log(`🔧 XAMPP MySQL porta 3306 + phpMyAdmin http://localhost/phpmyadmin (DB vectra_db)`);
  console.log(`💡 Run: npm install && npm start`);
});

