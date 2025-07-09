const express = require('express');
const cors = require('cors');
const repository = require('./repository/todo');
const todoService = require('./service/todo')(repository);
const todoRoutes = require('./routes/todoroutes');

const server = () => {
  const server = express();
  server.use(express.json());
  server.use(cors());

  server.use('/api/todo', todoRoutes(todoService));  

  return server;
};

module.exports = server;