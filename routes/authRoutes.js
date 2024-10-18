import {
  adminLogin,
  createAdmin,
  upadteAdminPassword,
} from '../controllers/auth/admin.js';
import {
  createUser,
  userLogin,
  upadteUserPassword,
} from '../controllers/auth/users.js';
import express from 'express';
import { isAdmin } from '../middleware/is-admin.js';
const router = express.Router();
router.post('/admin/login', adminLogin);
router.post('/admin/create', createAdmin);
router.patch('/upadtePassword/:id', upadteAdminPassword);
router.post('/user/create', createUser);
router.post('/userLogin', userLogin);
router.post('/updateUserPassword/:phone', upadteUserPassword);
export default router;
