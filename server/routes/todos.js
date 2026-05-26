const express = require('express')
const authMiddleware = require('../middleware/auth')
const {
  listTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todos')

const router = express.Router()

router.use(authMiddleware)

router.get('/', listTodos)
router.get('/:id', getTodoById)
router.post('/', createTodo)
router.put('/:id', updateTodo)
router.delete('/:id', deleteTodo)

module.exports = router