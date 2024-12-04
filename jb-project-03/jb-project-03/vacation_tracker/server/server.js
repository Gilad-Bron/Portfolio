// Import required
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql2 = require('mysql2');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const {mergeUniqueVacations} = require("./utils/data-tools");
const _ = require("lodash");
const app = express();
const PORT_NUMBER_SERVER = 8080;
const PORT_NUMBER_SQL = 3306;

// Middleware
app.use(session({
    secret: '91cc8935ba470e774505c7d9957aa41cf4932800d6b835bebdbadea0105f404a',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: null,
        httpOnly: false,
        sameSite: 'lax',
    },
}));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Routes
const routes = {
    api: {
        users: '/api/users',
        vacations: '/api/vacations',
        favorites: '/api/favorites',
    },
    web: {
        home: '/',
        login: '/login',
        logout: '/logout',
    }
};

// Multer file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../src/assets/images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Database connection
const conn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    port: PORT_NUMBER_SQL,
    password: '',
    database: 'skyroads',
});

conn.connect((err) => {
    if (err) {
        console.log('MySQL connection failed: ' + err);
        return;
    }
    console.log('MySQL server is running on http://localhost:' + PORT_NUMBER_SQL);
});

// Request Handlers (API)
app.get(routes.api.users, (req, res) => {
    let sql;
    if (req.session.user) {
        sql = `SELECT * FROM users WHERE ID = ${req.session.user.ID}`
    } else if (req.query.id) {
        sql = `SELECT * FROM users WHERE ID = ${req.query.id}`;
    }
    if (!sql) {
        res.send("Invalid query parameters");
        return;
    }
    conn.query(sql, (err, result) => {
        if (err) {
            console.log('Error in app.get routes.api.users: ' + err);
            return;
        }
        res.send(result);
    });
});

app.post(routes.api.users, (req, res) => {
    console.log(`POST request - route: ${routes.api.users} - req.query: ${JSON.stringify(req.query)} - req.body: ${JSON.stringify(req.body)}`);

    const data = req.body;
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const sql = `INSERT INTO users (first_name, last_name, email, password, role) VALUES ('${data.first_name}', '${data.last_name}', '${data.email}', '${hashedPassword}', 'user')`;

    conn.query(sql, (err, result) => {
        if (err) {
            console.log('Error in app.post routes.api.users: ' + err);
            return;
        }
        res.send(`Data inserted successfully! app.post routes.api.users`);
    });
});

app.get(routes.api.vacations, (req, res) => {
    if (req.query.vacationId) {
        throw new Error("Hubba hubba")
        // const sql = `SELECT * FROM vacations WHERE ID = ${req.query.vacationId}`;
        // conn.query(sql, (err, result) => {
        //     if (err) {
        //         console.log('Error in app.get routes.api.vacations: ' + err);
        //         return;
        //     }
        //     res.send(result);
        // });
    } else {
        const sql = 'SELECT * FROM vacations INNER JOIN users_vacations ON vacations.ID = users_vacations.vacation_id'
        conn.query(sql, (err, resultWithFavorites) => {
            if (err) {
                console.log('Error in app.get routes.api.vacations: ' + err);
                return;
            }
            conn.query('SELECT * FROM vacations', (err, allResults) => {
                if (err) {
                    console.log('Error in app.get routes.api.vacations: ' + err);
                    return;
                }

                const both = [...mergeUniqueVacations(resultWithFavorites), ...allResults]
                const clean = _.uniqBy(both, 'ID')

                res.send(clean);
            })
        });
    }
});

app.post(routes.api.vacations, (req, res) => {
    console.log(`POST request - route: ${routes.api.vacations} - req.body: ${JSON.stringify(req.body)}`);

    const data = req.body;
    if (data.image === '' || data.image === null || data.image === undefined) {
        data.image = 'default.jpg';
    };
    const sql = `INSERT INTO vacations (destination, description, start_date, end_date, price, image) VALUES ('${data.destination}', '${data.description}', '${data.start_date}', '${data.end_date}', '${data.price}', '${data.image}')`;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log('Error in app.post routes.api.vacations: ' + err);
            return;
        }
        res.send(`Data inserted successfully! app.post routes.api.vacations: ${JSON.stringify(data)}`);
    });
});

app.put(routes.api.vacations, (req, res) => {
    console.log(`PUT request - route: ${routes.api.vacations} - req.body: ${JSON.stringify(req.body)}`);

    const data = req.body;
    const sql = `UPDATE vacations SET destination = '${data.destination}', description = '${data.description}', start_date = '${data.start_date}', end_date = '${data.end_date}', price = '${data.price}', image = '${data.image}' WHERE ID = ${data.ID}`;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log('Error in app.put routes.api.vacations: ' + err);
            return;
        }
        res.send(`Data updated successfully! app.put routes.api.vacations: ${JSON.stringify(data)}`);
    });
});

app.delete(routes.api.vacations, (req, res) => {
    console.log(`DELETE request - route: ${routes.api.vacations} - req.query: ${JSON.stringify(req.query)}`);

    const id = req.query.id;
    const sql = `DELETE FROM vacations WHERE ID = ${id}`;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log('Error in app.delete routes.api.vacations: ' + err);
            return;
        }
        res.send(`Data deleted successfully! app.delete routes.api.vacations: ${JSON.stringify(id)}`);
    });
});

app.get(routes.api.favorites, (req, res) => {
    let sql;

    if (req.query.vacation_id) {
        sql = `SELECT * FROM users_vacations WHERE vacation_id = ${req.query.vacation_id}`;
    }

    if (req.session.user && !req.query.vacation_id) {
        sql = `SELECT vacation_id FROM users_vacations WHERE user_id = ${req.session.user?.ID}`;
    }

    if (req.query.barChart === 'true') {
        sql = `SELECT destination, COUNT(vacation_id) AS count FROM users_vacations INNER JOIN vacations ON users_vacations.vacation_id = vacations.ID GROUP BY vacation_id`;
    }

    if (!sql) {
        res.send("Invalid query parameters");
        return;
    }

    conn.query(sql, (err, result) => {
        if (err) {
            console.log('Error in app.get routes.api.favorites: ' + err);
            return;
        }
        res.send(result);
    });
});

app.post(routes.api.favorites, (req, res) => {
    console.log(`POST request - route: ${routes.api.favorites} - req.body: ${JSON.stringify(req.body)} - user: ${JSON.stringify(req.session.user?.ID + ' ' + req.session.user?.first_name)}`);

    let sql;
    let message;
    const isAddFavorite = req.query.isAddFavorite;
    const data = req.body;

    if (isAddFavorite == 'true') {
        sql = `INSERT INTO users_vacations (user_id, vacation_id) VALUES ('${req.session.user.ID}', '${data.vacation_id}')`;
        message = 'added to favorites cardData.ID = ' + data.vacation_id;
    } else {
        sql = `DELETE FROM users_vacations WHERE user_id = ${req.session.user.ID} AND vacation_id = ${data.vacation_id}`;
        message = 'removed from favorites cardData.ID = ' + data.vacation_id;
    };

    conn.query(sql, (err, result) => {
        if (err) {
            console.log('Error in app.post routes.api.favorites: ' + err);
            return;
        }
        console.log(message)
        res.send('success');
    });
});

app.get(routes.web.logout, (req, res) => {
    console.log(`GET request - route: ${routes.web.logout} - destroying session: ${JSON.stringify(req.session.user)}`);
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to logout');
            return;
        }
        res.send('success');
    });
});

app.post('/upload', upload.single('image'), (req, res) => {
    console.log('POST request - route: /upload - req.file:', req.file);
    res.send('File uploaded successfully');
});

// Request Handlers (WEB)
app.get(routes.web.home, (req, res) => {
    console.log(`GET request: ${routes.api.users} | req.query: ${JSON.stringify(req.query)} | req.session.user: ${JSON.stringify(req.session.user?.ID + ' ' + req.session.user?.first_name)}`);
    if (req.session.user) {
        res.send({
            authenticated: true,
            user: req.session.user
        });
    } else {
        res.send({
            authenticated: false,
            user: null
        });
    };
});

app.post(routes.web.login, (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sql = `SELECT * FROM users WHERE email = '${email}'`;

    conn.query(sql, (err, result) => {
        if (err) {
            console.error('Error in app.post routes.web.login:', err);
            res.status(500);
            return;
        };
        if (result.length === 0) {
            console.error('No results found in app.post routes.web.login:', result);
            res.send('Invalid email or password');
            return;
        };

        const user = result[0];

        if (bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).send('Failed to save session');
                }
                console.log('Authenticated successfully! req.session.user:', req.session.user, 'req.sessionID:', req.sessionID);
                return res.send('success');
            });
        } else {
            res.send('Invalid email or password');
        };
    });
});

// Start server
app.listen(PORT_NUMBER_SERVER, () => {
    console.log('Server is running on http://localhost:' + PORT_NUMBER_SERVER);
});
