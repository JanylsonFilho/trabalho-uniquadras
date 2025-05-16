// middlewares/authMiddleware.js
function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.status(401).json({ error: 'Usuário não autenticado' });
  }
}

module.exports = verificarAutenticacao;
