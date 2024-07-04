const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Final"
});

db.connect(err => {
    if (err) {
        console.log('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Registro
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], (err, result) => {
        if (err) {
            res.status(500).json({ msg: err.message });
        } else {
            res.status(201).json(result);
        }
    });
});

// Inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            res.status(500).json({ msg: err.message });
        } else if (results.length > 0) {
            const user = results[0];
            const isValid = bcrypt.compareSync(password, user.password);

            if (isValid) {
                const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ msg: 'Credenciales incorrectas' });
            }
        } else {
            res.status(404).json({ msg: 'Usuario no encontrado' });
        }
    });
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Rutas CRUD para empleados (protegidas)

app.post("/create",(req,res)=>{ //aqui registramos
    const nombre= req.body.nombre;
    const edad= req.body.edad;
    const pais= req.body.pais;
    const cargo= req.body.cargo;
    const años= req.body.años;

    db.query('INSERT INTO empleados(nombre,edad,pais,cargo,años) VALUES(?,?,?,?,?)',[nombre,edad,pais,cargo,años],
        (err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send(result)
            }
        }
    );
});


app.get("/empleados",(req,res)=>{ //aqui MOSTRAMOS

    db.query('SELECT*FROM empleados ',
        (err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send(result);
            }
        }
    );
});

app.put("/update",(req,res)=>{ //aqui actualizamos
    const id= req.body.id;
    const nombre= req.body.nombre;
    const edad= req.body.edad;
    const pais= req.body.pais;
    const cargo= req.body.cargo;
    const años= req.body.años;

    db.query('UPDATE empleados SET nombre=?,edad=?,pais=?,cargo=?,años=? WHERE id=?',[nombre,edad,pais,cargo,años,id],
        (err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send(result)
            }
        }
    );
});

app.delete("/delete/:id",(req,res)=>{ //aqui eliminamos
    const id= req.params.id;
   

    db.query('DELETE FROM empleados WHERE id=?',id,
        (err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send(result)
            }
        }
    );
});


app.listen(3001,()=>{console.log("Corriendo en el puerto 3001")})
