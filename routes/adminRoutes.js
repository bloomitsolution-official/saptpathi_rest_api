import express from 'express';
import {
  createPlan,
  deletePlan,
  updatePlan,
} from '../controllers/admin/plans.js';
import { updateSubscriptions } from '../controllers/admin/memberPlans.js';
import { listAllEnquiries } from '../controllers/user/users.js';

import {
  CreateBanners,
  deleteBanner,
  getAllBanners,
} from '../controllers/admin/banner.js';

import { addCouples, getCouplesList } from '../controllers/user/couples.js';
import { getUserDetails } from '../controllers/admin/users.js';
import {
  addGallery,
  deleteGallery,
  getGallery,
} from '../controllers/admin/gallery.js';
import { isAdmin } from '../middleware/is-admin.js';
import { listReviews } from '../controllers/user/review.js';
import { deleteUser } from '../controllers/auth/users.js';
const router = express.Router();

router.post('/createplan', isAdmin, createPlan);
router.patch('/updateSubscriptions/:id', isAdmin, updateSubscriptions);
router.delete('/deleteplan/:id', isAdmin, deletePlan);

//update plan
router.patch('/updatePlan/:id', isAdmin, updatePlan);

//Enquire
router.get('/list-enquiry', isAdmin, listAllEnquiries);
//delete-user
router.delete('/deleteUser/:userId', isAdmin, deleteUser);
//list-users
router.get('/getUserDetails', isAdmin, getUserDetails);

//Add photos
router.post('/addGallery', isAdmin, addGallery);
router.get('/getGallery', getGallery);
router.delete('/deleteGallery/:id', deleteGallery);
//add couples data
router.post('/addCouplesData', isAdmin, addCouples);
router.get('/couples', isAdmin, getCouplesList);
//
router.post('/create-banner', CreateBanners);
router.get('/listBanner', getAllBanners);
router.delete('/delete-banner/:id', deleteBanner);

router.get('/list-reviews', isAdmin, listReviews);
export default router;
