```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import { Logger } from 'some-logger-library'; // Replace with actual logger library

const MONGO_URI = process.env.MONGO_URI || '';
const DATABASE_NAME = 'taskmaster6';
const COLLECTION_NAME = 'tasks';

const logger = new Logger();

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: Date;
  createdDate: Date;
}

const validateStatus = (status: string): boolean => {
  const validStatuses = ['pending', 'in-progress', 'completed', 'archived'];
  return validStatuses.includes(status);
};

const updateTaskStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id, status } = req.body;

  if (!id || typeof id !== 'string') {
    logger.error('Invalid task ID');
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  if (!status || !validateStatus(status)) {
    logger.error('Invalid task status');
    return res.status(400).json({ error: 'Invalid task status' });
  }

  let client: MongoClient;

  try {
    client = await MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(DATABASE_NAME);
    const collection = db.collection<Task>(COLLECTION_NAME);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      logger.warn(`Task with ID ${id} not found`);
      return res.status(404).json({ error: 'Task not found' });
    }

    logger.info(`Task with ID ${id} updated successfully`);
    return res.status(200).json({ message: 'Task status updated successfully' });

  } catch (error) {
    logger.error('Database connection error', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export default updateTaskStatus;
```