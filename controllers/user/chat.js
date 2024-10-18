import { ChatMessage } from '../../model/index.js';
// API endpoint to get messages
export const fetchMessages = async (req, res, next) => {
  const { toUser } = req.params;
  try {
    const messages = await ChatMessage.findAll({
      where: { toUser },
      order: [['timestamp', 'ASC']],
    });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// API endpoint to post a new message
export const sendMessage = async (req, res, next) => {
  const { toUser, message } = req.body;
  const fromUser = req.id;
  try {
    const newMessage = await ChatMessage.create({ fromUser, toUser, message });
    return res.status(201).send(newMessage);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
