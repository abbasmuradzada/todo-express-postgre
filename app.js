const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 8000;
const { Sequelize, Model, DataTypes, where } = require("sequelize");

// const api = require("./mongo");

const sequelize = new Sequelize("todos", "postgres", "abbas123", {
  host: "localhost",
  dialect: "postgres",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const Todos = sequelize.define(
  "Todos",
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "Todos",
    timestamps: false,
    // Other model options go here
  }
);

sequelize.sync({ alter: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/todo", async (req, res) => {
  const { name } = req.body;
  try {
    const todo = await sequelize.models.Todos.create({
      name,
    });
    res.json(todo);
  } catch (error) {
    console.log(error);
  }
});

app.put("/todo", async (req, res) => {
  const { name } = req.body;
  const { id } = req.query;
  try {
    const todo = await sequelize.models.Todos.update(
      {
        name,
      },
      { where: { id } }
    );
    res.json(todo);
  } catch (error) {
    console.log(error);
  }
});

app.get("/todos", async (req, res) => {
  // const { name } = req.body;
  try {
    const todo = await sequelize.models.Todos.findAll();
    res.json(todo);
  } catch (error) {
    console.log(error);
  }
});

app.get("/todo", async (req, res) => {
  const { id } = req.query;
  try {
    const todo = await sequelize.models.Todos.findOne({ where: { id } });
    res.json(todo);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/todo", async (req, res) => {
  const { id } = req.query;
  try {
    const todo = await sequelize.models.Todos.destroy({ where: { id } });
    res.json(todo);
  } catch (error) {
    console.log(error);
  }
});

// mongoose
//   .connect(api.url)
//   .then(() => {
app.listen(port);
//   })
//   .catch((err) => console.log(err));
