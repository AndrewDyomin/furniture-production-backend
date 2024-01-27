const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("node:path");
require("./db");

const ordersRouter = require("./routes/api/orders");
const authRoutes = require("./routes/api/auth");
const usersRoutes = require("./routes/api/users");
const collectionsRoutes = require("./routes/api/collections")
const isAuth = require("./middlewares/isAuth");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use("/avatars", express.static(path.join(__dirname, "public", "avatars")));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/orders", isAuth, ordersRouter);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/collections", collectionsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
