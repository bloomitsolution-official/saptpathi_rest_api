import express from 'express';
import {
  createPlan,
  deletePlan,
  updatePlan,
} from '../controllers/admin/plans.js';
import { updateSubscriptions } from '../controllers/admin/memberPlans.js';
import { deleteInquary, listAllEnquiries } from '../controllers/user/users.js';

import {
  CreateBanners,
  deleteBanner,
  getAllBanners,
} from '../controllers/admin/banner.js';

import { addCouples, deleteCouple, getCouplesList, updatCouple } from '../controllers/user/couples.js';
import { getUserDetails } from '../controllers/admin/users.js';
import {
  addGallery,
  deleteGallery,
  getGallery,
} from '../controllers/admin/gallery.js';
import { isAdmin } from '../middleware/is-admin.js';
import { listReviews } from '../controllers/user/review.js';
import { deleteUser } from '../controllers/auth/users.js';
import { allUserSubscription } from '../controllers/admin/suscriptions.js';
import { CreateTeam, deleteTeamMember, getAllTeamMember } from '../controllers/admin/Team.js';
const router = express.Router();

router.post('/createplan', isAdmin, createPlan);
router.patch('/updateSubscriptions/:id', isAdmin, updateSubscriptions);
router.delete('/deleteplan/:id', isAdmin, deletePlan);

//suscriptions.....
router.get('/user-suscription', isAdmin, allUserSubscription);


//update plan
router.patch('/updatePlan/:id', isAdmin, updatePlan);
router.patch('/updateCouple/:id', isAdmin, updatCouple);
router.delete('/deleteCouple/:id', isAdmin, deleteCouple);

//Enquire
router.get('/list-enquiry', isAdmin, listAllEnquiries);
router.delete('/deleteInquary/:id', isAdmin, deleteInquary);
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
router.get('/couples', getCouplesList);
//

//Team Member

router.post('/createTeamMember',CreateTeam)
router.get('/getAllTeamMembers',getAllTeamMember)
router.delete('/deleteTeamMember/:id',deleteTeamMember)


//create banner
router.post('/create-banner', CreateBanners);
router.get('/listBanner', getAllBanners);
router.delete('/delete-banner/:id', deleteBanner);

router.get('/list-reviews', listReviews);
export default router;
