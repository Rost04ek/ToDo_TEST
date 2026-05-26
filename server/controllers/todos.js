const { ToDo } = require('../models')

const allowedStatuses = new Set(['todo', 'in progress', 'done'])

const listTodos = async (req, res) => {
  const where = { userId: req.user.id }

  if (req.query.status) {
    if (!allowedStatuses.has(req.query.status)) {
      return res.status(400).json({ message: 'Invalid status filter' })
    }

    where.status = req.query.status
  }

  const todos = await ToDo.findAll({ where, order: [['createdAt', 'DESC']] })
  return res.json(todos)
}

const getTodoById = async (req, res) => {
  const todo = await ToDo.findOne({ where: { id: req.params.id, userId: req.user.id } })

  if (!todo) {
    return res.status(404).json({ message: 'Task not found' })
  }

  return res.json(todo)
}

const createTodo = async (req, res) => {
  const { title, description = '', status = 'todo' } = req.body

  if (!title) {
    return res.status(400).json({ message: 'title is required' })
  }

  if (!allowedStatuses.has(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  const maxSeqRow = await ToDo.findOne({
    where: { userId: req.user.id },
    order: [['seq', 'DESC']],
    attributes: ['seq'],
  })

  const nextSeq = (maxSeqRow && maxSeqRow.seq) ? maxSeqRow.seq + 1 : 1

  const todo = await ToDo.create({
    title,
    description,
    status,
    userId: req.user.id,
    seq: nextSeq,
  })

  return res.status(201).json(todo)
}

const updateTodo = async (req, res) => {
  const todo = await ToDo.findOne({ where: { id: req.params.id, userId: req.user.id } })

  if (!todo) {
    return res.status(404).json({ message: 'Task not found' })
  }

  const { title, description, status } = req.body
  const nextStatus = status ?? todo.status

  if (status && !allowedStatuses.has(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  await todo.update({
    title: title ?? todo.title,
    description: description ?? todo.description,
    status: nextStatus,
  })

  return res.json(todo)
}

const deleteTodo = async (req, res) => {
  const todo = await ToDo.findOne({ where: { id: req.params.id, userId: req.user.id } })

  if (!todo) {
    return res.status(404).json({ message: 'Task not found' })
  }

  await todo.destroy()

  return res.status(204).send()
}

module.exports = {
  listTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
}