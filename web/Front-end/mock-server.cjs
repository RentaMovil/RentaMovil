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

    const newUser = {
        id: randomUUID(),
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

// PATCH /notifications/:notification_id/read
//
// La lista `GET /notifications` la sirve json-server solo, a partir de la
// coleccion `notifications` de db.json. El "marcar como leida" si necesita una
// ruta propia: json-server solo expone PUT/PATCH sobre el recurso entero, y
// el cliente (web y app) espera `PATCH /notifications/:id/read`.
//
// A diferencia del resto de rutas, NO va con requireAuth: el web tambien
// consume este endpoint y su httpClient solo adjunta el Bearer cuando hay
// sesion en memoria.
server.patch('/notifications/:notification_id/read', (req, res) => {
    const id = Number(req.params.notification_id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'Identificador inválido' });
    }

    const notification = db.get('notifications').find({ notification_id: id }).value();

    if (!notification) {
        return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    db.get('notifications')
        .find({ notification_id: id })
        .assign({ is_read: true, read_at: new Date().toISOString() })
        .write();

    res.json(db.get('notifications').find({ notification_id: id }).value());
});

// ─────────────────────────────────────────────────────────────────────────────
// Servicio de telemetria GPS (EP-006 / HU-GPS-001)
//
// La API no tenia contrato de GPS, asi que se define aqui. Los endpoints
// cuelgan de `/gps` y no se delegan a json-server, porque hay que cruzar tres
// colecciones (gps + vehicles + rentals) para devolver "la ultima posicion
// conocida de cada vehiculo alquilado".
//
// PENDIENTE — INV-002: la regla de negocio pide que solo ADMIN/SUPER_ADMIN
// puedan leer la ubicacion y que un CLIENT reciba 403. Ahora estas rutas solo
// exigen sesion (`requireAuth`). Para cerrarlo basta con encadenar
// `requireRole("ADMIN", "SUPER_ADMIN")` en las tres de abajo.
//
// Estas rutas usan `Array.prototype` y no cadenas de lodash a proposito:
// dentro de una cadena, `.reverse()` devuelve un array plano en vez de un
// wrapper, y encadenar `.find().value()` detras rompe la consulta.
// ─────────────────────────────────────────────────────────────────────────────

/** Lee una coleccion del db como array plano. */
function readCollection(name) {
    return db.get(name).value() || [];
}

/** Ordena una lista de posiciones de mas reciente a mas antigua. */
function byNewestFirst(a, b) {
    return String(b.recorded_at).localeCompare(String(a.recorded_at));
}

/**
 * Ultima posicion conocida por vehiculo, junto con el vehiculo y la rental que
 * la produjo. Solo se incluyen vehiculos con una rental IN_PROGRESS: uno sin
 * alquiler activo no se puede supervisar.
 */
function listTrackedVehicles() {
    const vehicles = readCollection('vehicles');
    const users = readCollection('users');
    const positions = readCollection('gps');
    const devices = readCollection('gpsDevices');
    const activeRentals = readCollection('rentals').filter((r) => r.status === 'IN_PROGRESS');

    return activeRentals
        .map((rental) => {
            const vehicle = vehicles.find((v) => v.id === rental.vehicle_id);
            if (!vehicle) return null;

            const position = positions
                .filter((p) => p.vehicle_id === rental.vehicle_id)
                .sort(byNewestFirst)[0];
            if (!position) return null;

            // El nombre del cliente sale de `users`, no de la rental: si se
            // guardara en la rental podria desincronizarse del usuario real.
            const customer = users.find((u) => u.id === rental.customer_id);

            // Estado del tracker. La interfaz lo usa para avisar cuando la
            // posicion que ve es del ultimo reporte y no una senal en vivo.
            const device = devices.find((d) => d.id === rental.gps_id);
            const deviceSummary = device
                ? {
                    id: device.id,
                    model: device.model,
                    provider: device.provider,
                    status: device.status,
                    connected: device.connected,
                    last_seen_at: device.last_seen_at,
                }
                : null;

            return {
                vehicle_id: vehicle.id,
                plate: vehicle.plate,
                brand: vehicle.brand,
                model: vehicle.model,
                vehicle_type: vehicle.vehicleType,
                status: vehicle.status,
                device: deviceSummary,
                rental: {
                    id: rental.id,
                    status: rental.status,
                    customer_id: rental.customer_id,
                    customer_name: customer
                        ? `${customer.first_name} ${customer.last_name}`
                        : null,
                    start_date: rental.start_date,
                    end_date: rental.end_date,
                    gps_id: rental.gps_id,
                },
                position: {
                    latitude: position.latitude,
                    longitude: position.longitude,
                    speed: position.speed,
                    heading: position.heading,
                    ignition: position.ignition,
                    recorded_at: position.recorded_at,
                },
            };
        })
        .filter(Boolean);
}

// GET /gps/vehicles
server.get('/gps/vehicles', requireAuth, (req, res) => {
    res.json(listTrackedVehicles());
});

// GET /gps/vehicles/:vehicle_id
server.get('/gps/vehicles/:vehicle_id', requireAuth, (req, res) => {
    const { vehicle_id } = req.params;

    const tracked = listTrackedVehicles().find((v) => v.vehicle_id === vehicle_id);
    if (!tracked) {
        return res.status(404).json({ message: 'El vehiculo no tiene una rental en curso ni posicion registrada' });
    }

    res.json(tracked);
});

// GET /gps/vehicles/:vehicle_id/track
//
// Historial de posiciones, para dibujar la ruta recorrida.
server.get('/gps/vehicles/:vehicle_id/track', requireAuth, (req, res) => {
    const { vehicle_id } = req.params;

    const track = readCollection('gps')
        .filter((p) => p.vehicle_id === vehicle_id)
        .sort(byNewestFirst);

    if (!track.length) {
        return res.status(404).json({ message: 'El vehiculo no tiene posiciones registradas' });
    }

    res.json(track);
});

// PATCH /auth/me
//
// Guarda los cambios del perfil del usuario autenticado.
//
// Solo se aceptan los campos de una lista blanca. `email`, `role`, `status`
// y `password_hash` se ignoran aunque vengan en el cuerpo: el rol no puede
// cambiarse a si mismo desde el perfil, el correo es otra operacion (con
// verificacion) y la contrasena tiene su propia ruta en
// `PATCH /auth/me/password`.
server.patch('/auth/me', requireAuth, (req, res) => {
    const user = db.get('users').find({ id: req.auth.sub }).value();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const cuerpo = req.body || {};
    const permitidos = {
        first_name: 'first_name',
        last_name: 'last_name',
        phone: 'phone',
        username: 'username',
    };

    const cambios = {};
    const ignorados = [];

    for (const [clave, valor] of Object.entries(cuerpo)) {
        if (!(clave in permitidos)) {
            ignorados.push(clave);
            continue;
        }
        // Solo texto, y no vacio: evita guardar un perfil en blanco.
        if (typeof valor !== 'string') {
            ignorados.push(clave);
            continue;
        }
        const limpio = valor.trim();
        if (!limpio) {
            ignorados.push(clave);
            continue;
        }
        cambios[permitidos[clave]] = limpio;
    }

    if (!Object.keys(cambios).length) {
        return res.status(400).json({
            message: 'No hay cambios validos para guardar',
            ignored: ignorados,
        });
    }

    db.get('users').find({ id: user.id }).assign(cambios).write();

    res.json({
        ...toPublicUser(db.get('users').find({ id: user.id }).value()),
        ignored_fields: ignorados,
    });
});

server.use(router); // /vehicles, /maintenances, /notifications siguen igual

server.listen(3001, () => console.log('Mock API con JWT en http://localhost:3001'));