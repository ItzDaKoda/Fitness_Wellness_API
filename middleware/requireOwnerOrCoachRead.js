module.exports = function requireOwnerOrCoachRead(getOwnerIdFromReq) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required" });

    const ownerId = getOwnerIdFromReq(req);
    if (req.user.role === "coach") return next();       // coach can read
    if (Number(ownerId) !== Number(req.user.id)) {
      return res.status(403).json({ error: "Forbidden: not your resource" });
    }
    next();
  };
};
