const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (!(parts.length === 2)) {
    return res.status(401).json({ message: "Token error" });
  }

  const [scheme, token] = parts;

  //Regex para verificar se a string scheme possui a palavra "Bearer"(ou "bearer")
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Token is malformatted" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id;

    return next();
  });
};
