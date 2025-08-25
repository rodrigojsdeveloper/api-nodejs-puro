import { randomUUID } from 'node:crypto'

const tasks = []

const sendJSON = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(data ? JSON.stringify(data) : undefined)
}

const findTaskIndex = (id) => tasks.findIndex((task) => task.id === id)

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler: (_, res) => {
      return sendJSON(res, 200, tasks)
    },
  },
  {
    method: 'POST',
    path: '/tasks',
    handler: (req, res) => {
      const { title, description } = req.body || {}

      if (!title || !description) {
        return sendJSON(res, 400, { message: 'title e description são obrigatórios' })
      }

      const now = new Date().toISOString()
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        createdAt: now,
        updatedAt: now,
      }

      tasks.push(task)
      return sendJSON(res, 201, task)
    }
  },
  {
    method: 'PUT',
    path: '/tasks/:id',
    handler: (req, res) => {
      const { id } = req.params || {}
      const { title, description } = req.body || {}

      if (!id) {
        return sendJSON(res, 400, { message: 'id obrigatório' })
      }

      const taskIndex = findTaskIndex(id)

      if (taskIndex === -1) {
        return sendJSON(res, 404, { message: 'task não encontrada' })
      }

      const task = tasks[taskIndex]
      tasks[taskIndex] = {
        ...task,
        title: title ?? task.title,
        description: description ?? task.description,
        updatedAt: new Date().toISOString(),
      }

      return sendJSON(res, 200, tasks[taskIndex])
    }
  },
  {
    method: 'PATCH',
    path: '/tasks/:id',
    handler: (req, res) => {
      const { id } = req.params || {}

      if (!id) {
        return sendJSON(res, 400, { message: 'id obrigatório' })
      }

      const taskIndex = findTaskIndex(id)

      if (taskIndex === -1) {
        return sendJSON(res, 404, { message: 'task não encontrada' })
      }

      tasks[taskIndex] = {
        ...tasks[taskIndex],
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      return sendJSON(res, 204)
    }
  },
  {
    method: 'DELETE',
    path: '/tasks/:id',
    handler: (req, res) => {
      const { id } = req.params || {}

      if (!id) {
        return sendJSON(res, 400, { message: 'id obrigatório' })
      }

      const taskIndex = findTaskIndex(id)

      if (taskIndex === -1) {
        return sendJSON(res, 404, { message: 'task não encontrada' })
      }

      tasks.splice(taskIndex, 1)

      return sendJSON(res, 204)
    }
  }
]
