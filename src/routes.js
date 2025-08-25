import { randomUUID } from 'node:crypto'

const tasks = []

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: '/tasks',
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({ message: 'title e description são obrigatórios' }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      tasks.push(task)

      return res.writeHead(201).end(JSON.stringify(task))
    }
  },
  {
    method: 'PUT',
    path: '/tasks/:id',
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!id) {
        return res.writeHead(400).end(JSON.stringify({ message: 'id obrigatório' }))
      }

      const taskIndex = tasks.findIndex(task => task.id === id)

      if (taskIndex === -1) {
        return res.writeHead(404).end(JSON.stringify({ 'message': 'task não encontrada' }))
      }

      tasks[taskIndex].title = title
      tasks[taskIndex].description = description

      return res.end(JSON.stringify(tasks[taskIndex]))
    }
  },
  {
    method: 'PATCH',
    path: '/tasks/:id',
    handler: (req, res) => {
      const { id } = req.params

      if (!id) {
        return res.writeHead(400).end(JSON.stringify({ message: 'id obrigatório' }))
      }

      const taskIndex = tasks.findIndex(task => task.id === id)

      if (taskIndex === -1) {
        return res.writeHead(404).end(JSON.stringify({ message: 'task não encontrada' }))
      }

      tasks[taskIndex].completed_at = new Date().toISOString()

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: '/tasks/:id',
    handler: (req, res) => {
      const { id } = req.params

      if (!id) {
        return res.writeHead(400).end(JSON.stringify({ message: 'id obrigatório' }))
      }

      const taskIndex = tasks.findIndex(task => task.id === id)

      if (taskIndex === -1) {
        return res.writeHead(404).end(JSON.stringify({ message: 'task não encontrada' }))
      }

      tasks.splice(taskIndex, 1)

      return res.writeHead(204).end()
    }
  }
]
