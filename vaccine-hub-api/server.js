const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { PORT } = require("./config");
const { BadRequestError, NotFoundError } = require("./utils/errors");
const authRoutes = require("./routes/auth");

const app = express();

// enable cross-origin resource sharing
app.use(cors());
// parse incoming request with JSON
app.use(express.json());
// log request info
app.use(morgan("tiny"));

app.use("/auth", authRoutes);

// We didn't reach any endpoint
app.use((req, res, next) => {
  return next(new NotFoundError());
});

// Generic error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});
// Environment variable or the port we are accustomed to

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
