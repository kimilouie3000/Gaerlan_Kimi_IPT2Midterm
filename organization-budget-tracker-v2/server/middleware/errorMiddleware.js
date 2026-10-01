/**
 * Centralized JSON error handler. Express recognizes this middleware by
 * its four parameters; it should be registered after all routes.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with this value already exists." });
  }

  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred." });
}
