const { create, router: jsonRouter, defaults, bodyParser } = require('json-server');

const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const db = router.db;

//  Secretos de desarrollo — en el backend real esto vive en variables de entorno, nunca en el código
const ACCESS_TOKEN_SECRET = 'dev-access-secret';
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días, según session.expires_at

server.use(middlewares);
server.use(jsonServer.bodyParser);

function toPublicUser(user) {
    const { password_hash, ...publicUser } = user;
    return publicUser;
}

function issueTokens(user, req) {
    const accessToken = jwt.sign(
        { sub: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshToken = randomUUID();
    db.get('sessions').push({
        id: randomUUID(),
        user_id: user.id,
        refresh_token: refreshToken,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString(),
        ip_address: req.ip,
        user_agent: req.headers['user-agent'] || null,
        revoked: false,
    }).write();

    return { accessToken, refreshToken, expiresIn: 15 * 60 };
}

// Middleware para proteger rutas (ej. /auth/me)
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    try {
        req.auth = jwt.verify(token, ACCESS_TOKEN_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

// POST /auth/login
server.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.get('users').find({ email }).value();

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    if (user.status !== 'ACTIVE') {
        return res.status(403).json({ message: 'Cuenta inactiva o bloqueada' });
    }

    db.get('users').find({ id: user.id }).assign({ last_login: new Date().toISOString() }).write();

    const tokens = issueTokens(user, req);
    res.json({ ...tokens, user: toPublicUser(user) });
});

// POST /auth/register
server.post('/auth/register', (req, res) => {
    const { first_name, last_name, email, phone, username, password } = req.body;

    if (db.get('users').find({ email }).value()) {
        return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // Ids enteros, como en booking (person_id / client_id): siguiente al mayor existente
    const nextId = Math.max(0, ...db.get('users').map('id').value().map(Number).filter(Number.isFinite)) + 1;
    const newUser = {
        id: nextId,
        first_name, last_name, email, phone, username,
        password_hash: bcrypt.hashSync(password, 12),
        role: 'CLIENT',
        status: 'ACTIVE',
        last_login: null,
    };
    db.get('users').push(newUser).write();

    const tokens = issueTokens(newUser, req);
    res.status(201).json({ ...tokens, user: toPublicUser(newUser) });
});

// POST /auth/refresh
server.post('/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;
    const session = db.get('sessions').find({ refresh_token: refreshToken, revoked: false }).value();

    if (!session || new Date(session.expires_at) < new Date()) {
        return res.status(401).json({ message: 'Sesión expirada, inicia sesión de nuevo' });
    }

    const user = db.get('users').find({ id: session.user_id }).value();
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

    const accessToken = jwt.sign(
        { sub: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_TTL }
    );

    res.json({ accessToken, expiresIn: 15 * 60 });
});

// POST /auth/logout
server.post('/auth/logout', (req, res) => {
    const { refreshToken } = req.body;
    db.get('sessions').find({ refresh_token: refreshToken }).assign({ revoked: true }).write();
    res.status(204).end();
});

// GET /auth/me
server.get('/auth/me', requireAuth, (req, res) => {
    const user = db.get('users').find({ id: req.auth.sub }).value();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(toPublicUser(user));
});

// POST /auth/forgot-password
server.post('/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = db.get('users').find({ email }).value();
    if (!user) return res.status(404).json({ message: 'Correo no encontrado' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    db.get('verificationCodes').push({
        id: randomUUID(),
        user_id: user.id,
        code,
        type: 'PASSWORD_RESET',
        used: false,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    }).write();

    console.log(` Código para ${email}: ${code}`);
    res.json({ message: 'Código enviado' });
});

// POST /auth/verify-code
server.post('/auth/verify-code', (req, res) => {
    const { email, code } = req.body;
    const user = db.get('users').find({ email }).value();
    if (!user) return res.status(404).json({ message: 'Correo no encontrado' });

    const entry = db.get('verificationCodes')
        .find({ user_id: user.id, code, used: false, type: 'PASSWORD_RESET' })
        .value();

    if (!entry || new Date(entry.expires_at) < new Date()) {
        return res.status(400).json({ message: 'Código inválido o expirado' });
    }

    db.get('verificationCodes').find({ id: entry.id }).assign({ used: true }).write();
    res.json({ verified: true });
});

// POST /auth/reset-password
server.post('/auth/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    const user = db.get('users').find({ email }).value();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    db.get('users').find({ email }).assign({ password_hash: bcrypt.hashSync(newPassword, 12) }).write();
    res.json({ message: 'Contraseña actualizada' });
});
// PATCH /auth/me/password (requiere estar logueado)
server.patch('/auth/me/password', requireAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = db.get('users').find({ id: req.auth.sub }).value();

    if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }

    db.get('users').find({ id: user.id })
        .assign({ password_hash: bcrypt.hashSync(newPassword, 12) })
        .write();

    res.json({ message: 'Contraseña actualizada' });
});



// PATCH /auth/me — actualizar perfil del usuario logueado
server.patch('/auth/me', requireAuth, (req, res) => {
    const { first_name, last_name, phone, username, photo } = req.body;

    db.get('users').find({ id: req.auth.sub })
        .assign({ first_name, last_name, phone, username, photo })
        .write();

    const updated = db.get('users').find({ id: req.auth.sub }).value();
    res.json(toPublicUser(updated));
});

// DELETE /auth/me — cierre de cuenta (para cuando actives el modal de borrado)
server.delete('/auth/me', requireAuth, (req, res) => {
    db.get('sessions').remove({ user_id: req.auth.sub }).write();
    db.get('users').remove({ id: req.auth.sub }).write();
    res.status(204).end();
});

// GET /users — lista todos los usuarios (requiere sesión)
server.get('/users', requireAuth, (req, res) => {
    const users = db.get('users').value().map(toPublicUser);
    res.json(users);
});

// PATCH /users/:id/role — cambia el rol de un usuario (requiere sesión)
server.patch('/users/:id/role', requireAuth, (req, res) => {
    const { role } = req.body;
    // req.params.id llega como texto y los ids son enteros
    const id = Number(req.params.id);
    const user = db.get('users').find({ id }).value();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    db.get('users').find({ id }).assign({ role }).write();
    res.json(toPublicUser(db.get('users').find({ id }).value()));
});

server.use(router); // /vehicles, /maintenances siguen igual

// 3100 para no chocar con los servicios reales (3001-3005) ni con el gateway (8080). El proxy de Vite apunta aquí
const PORT = Number(process.env.PORT) || 3100;
server.listen(PORT, () => console.log(`Mock API con JWT en http://localhost:${PORT}`));