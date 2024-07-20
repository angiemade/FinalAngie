const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "Final"
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.log('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Registro de usuarios
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10); // Encriptación de la contraseña

    db.query('INSERT INTO usuarios (username, password, role_id) VALUES (?, ?, ?)', [username, hashedPassword, role], (err, result) => {
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

    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
        if (err) {
            res.status(500).json({ msg: err.message });
        } else if (results.length > 0) {
            const user = results[0];
            const isValid = bcrypt.compareSync(password, user.password); // Comparación de la contraseña

            if (isValid) {
                const token = jwt.sign({ id: user.id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token, role: user.role_id }); // Devuelve el rol como parte de la respuesta
            } else {
                res.status(401).json({ msg: 'Credenciales incorrectas' });
            }
        } else {
            res.status(404).json({ msg: 'Usuario no encontrado' });
        }
    });
});

// Cerrar sesión
app.post('/logout', (req, res) => {
    // En este caso no hay mucho que hacer en el servidor, simplemente responder que la sesión se ha cerrado
    res.json({ msg: 'Sesión cerrada' });
});



// Obtener roles
app.get('/roles', (req, res) => {
    db.query('SELECT id, nombre FROM roles', (err, results) => {
        if (err) {
            res.status(500).json({ msg: err.message });
        } else {
            res.json(results);
        }
    });
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


// // Crear nota
// app.post('/notas', authenticateToken, (req, res) => {
//     const { contenido } = req.body;
//     const usuario_id = req.user.id;
//     const role_id = req.user.role;

//     db.query('INSERT INTO notas (usuario_id, contenido, role_id) VALUES (?, ?, ?)', [usuario_id, contenido, role_id], (err, result) => {
//         if (err) {
//             res.status(500).json({ msg: err.message });
//         } else {
//             res.status(201).json(result);
//         }
//     });
// });

app.post('/notas', authenticateToken, (req, res) => {
    const { contenido } = req.body;
    const usuario_id = req.user.id;

    db.query('INSERT INTO notas (usuario_id, contenido) VALUES (?, ?)', [usuario_id, contenido], (err, result) => {
        if (err) {
            res.status(500).json({ msg: err.message });
        } else {
            res.status(201).json(result);
        }
    });
});


// // Obtener notas
// app.get('/notas', authenticateToken, (req, res) => {
//     db.query('SELECT notas.*, usuarios.username, roles.nombre AS role FROM notas JOIN usuarios ON notas.usuario_id = usuarios.id JOIN roles ON notas.role_id = roles.id', (err, results) => {
//         if (err) {
//             res.status(500).json({ msg: err.message });
//         } else {
//             res.json(results);
//         }
//     });
// });

app.get('/notas', authenticateToken, (req, res) => {
    db.query('SELECT notas.*, usuarios.username FROM notas JOIN usuarios ON notas.usuario_id = usuarios.id', (err, results) => {
        if (err) {
            res.status(500).json({ msg: err.message });
        } else {
            res.json(results);
        }
    });
});



// Crear empleado
app.post("/create", (req, res) => {
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const años = req.body.años;

    db.query('INSERT INTO empleados(nombre,edad,pais,cargo,años) VALUES(?,?,?,?,?)', [nombre, edad, pais, cargo, años],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Obtener todos los empleados
app.get("/empleados", (req, res) => {
    db.query('SELECT * FROM empleados', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Actualizar empleado
app.put("/update", (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const años = req.body.años;

    db.query('UPDATE empleados SET nombre=?,edad=?,pais=?,cargo=?,años=? WHERE id=?', [nombre, edad, pais, cargo, años, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Eliminar empleado
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM empleados WHERE id=?', id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log("Corriendo en el puerto 3001");
});
