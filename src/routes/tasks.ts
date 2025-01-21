import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();


interface TaskRequestBody {
  title: string;
  color?: string;
}


router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /tasks/:id
router.get(
  '/:id',
  async (req: Request<{ id: string }, {}, {}>, res: Response) => {
    const { id } = req.params;

    // Validate if the id is a valid number
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
      const task = await prisma.task.findUnique({
        where: { id: numericId },
      });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Could not fetch task' });
    }
  }
);

router.post('/', async (req: Request<{}, {}, TaskRequestBody>, res: Response): Promise<void> => {
  const { title, color } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  try {
    const newTask = await prisma.task.create({
      data: { title, color },
    });
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Could not create task' });
  }
});

router.put('/:id', async (req: Request<{ id: string }, {}, { title?: string; color?: string; completed?: boolean }>, res: Response) => {
  const { id } = req.params;
  const { title, color, completed } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, color, completed },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Could not update task' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTask = await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.json(deletedTask);
  } catch (error) {
    res.status(500).json({ error: 'Could not delete task' });
  }
});


export default router;
