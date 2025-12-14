// middleware/auth.js
const jwt = require("jsonwebtoken");

// In-memory token blocklist for logout
const tokenBlocklist = new Set();

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

function authenticate(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: "Authentication required" });

    if (tokenBlocklist.has(token)) {
      return res.status(401).json({ error: "Token has been logged out" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, email, iat, exp }
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}

function requireOwnerOrRole(getOwnerIdFn, ...allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Authentication required" });

      if (allowedRoles.includes(req.user.role)) return next();

      const ownerId = await getOwnerIdFn(req);
      if (ownerId == null) return res.status(404).json({ error: "Resource not found" });

      if (Number(ownerId) !== Number(req.user.id)) {
        return res.status(403).json({ error: "Forbidden: not your resource" });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

function logout(req, res) {
  tokenBlocklist.add(req.token);
  res.json({ message: "Logged out successfully" });
}

module.exports = { authenticate, requireRole, requireOwnerOrRole, logout };
