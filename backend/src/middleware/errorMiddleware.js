const errorMiddleware = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
};

module.exports = errorMiddleware;
