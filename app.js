import express from 'express';
import os from 'os';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import sequelize from './utilities/database.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import appRoutes from './routes/appRoutes.js';
import cluster from 'cluster';
import helmet from 'helmet';
import multer from 'multer';
import compression from 'compression'
import { Server as SocketIoServer } from 'socket.io';
import http from 'http';
import { centralError } from './middleware/error-handlers/central-error.js';
import { corsError } from './middleware/error-handlers/cors-error.js';
import { ChatMessage } from './model/index.js';

if (process.env.NODE_ENV) {
  dotenv.config();
}

const port = process.env.PORT || 8800;
const app = express();
app.use(corsError);
app.get('/', (req, res) => {
  res.send('Server health is good.');
});
const server = http.createServer(app);
const io = new SocketIoServer(server, {
  cors: {
    origin: ['https://sapthapadhi.vercel.app','https://sapthapadhi-67il.vercel.app', 'http://localhost:3000','http://localhost:3001','https://admin.sapthapadhimatrimony.in','https://sapthapadhimatrimony.in'],
    methods: ['GET', 'POST','DELETE','PUT','PATCH'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

const cpuCount = os.cpus().length;
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died, starting a new one...`);
    cluster.fork();
  });
} else {
  // Multer configuration
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dirMap = {
        image: './images',
        banner: './banners',
        icon: './icons',
        offers: './offers',
        qrCode: './qrCode',
      };
      const dir = dirMap[file.fieldname] || './images';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        new Date().toISOString().replace(/:/g, '-') +
          '-' +
          file.originalname.replace(/\s/g, '-'),
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    const validMimeTypes = [
      'image/jpg',
      'image/png',
      'image/jpeg',
      'application/pdf',
    ];
    cb(null, validMimeTypes.includes(file.mimetype));
  };

  // multer configuration
  app.use(
    multer({
      storage: fileStorage,
      fileFilter: fileFilter,
    }).fields([
      {
        name: 'image',
        maxCount: 5,
      },
      {
        name: 'icon',
        maxCount: 1,
      },
      {
        name: 'banner',
        maxCount: 5,
      },
      {
        name: 'document',
        maxCount: 3,
      },
    ]),
  );

  const __dirname = path.resolve();
  //defining absolute path of current WORKDIR

  app.use(express.urlencoded({ extended: false }));

  app.use(express.json({ limit: '1024mb' }));
  app.use(express.static(__dirname));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);
  app.use('/app', appRoutes);

  // API endpoint to get messages
  app.get('/app/messages/:toUser', async (req, res) => {
    const { toUser } = req.params;
    try {
      const messages = await ChatMessage.findAll({
        where: { toUser },
        order: [['timestamp', 'ASC']],
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // API endpoint to post a new message
  app.post('/app/messages', async (req, res) => {
    const { fromUser, toUser, message } = req.body;
    try {
      const newMessage = await ChatMessage.create({
        fromUser,
        toUser,
        message,
      });
      res.status(201).send(newMessage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  io.on('connection', socket => {
    console.log('A user connected');
  
    socket.on('sendMessage', async data => {
      console.log("SendMessage testing from user message")
      try {
        socket.broadcast.emit('messageiscomming', "update messsage");

        // const newMessage = await ChatMessage.create(data);
      } catch (error) {
        console.error('Failed to send message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
  
    socket.on('fetchMessages', async toUser => {
      const transaction = await sequelize.transaction();
      try {
        const messages = await ChatMessage.findAll({
          where: { toUser, delivered: false },
          order: [['timestamp', 'ASC']],
          transaction
        });
  
        socket.broadcast.emit('previousMessages', messages); 
  
        await ChatMessage.update(
          { delivered: true },
          { where: { id: messages.map(msg => msg.id) }, transaction }
        );
  
        // Broadcast the fetched messages to all other clients
        socket.broadcast.emit('newMessages', messages);
  
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        console.error('Failed to fetch messages:', error);
        socket.emit('error', { message: 'Failed to fetch messages' });
      }
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  


  app.use(helmet());
  app.use(compression());
  app.use(centralError);
  sequelize
    .sync()
    .then(() => {
      server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    })
    .catch(err => {
      console.log(err);
    });
}