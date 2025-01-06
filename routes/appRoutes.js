import express from 'express';
import { isUser } from '../middleware/isUser.js';
import { listPlan } from '../controllers/admin/plans.js';
import { buyPlan, userSubscription } from '../controllers/user/userPlan.js';
import { CreateOrder } from '../helper/create-order.js';
import { getAllBanners } from '../controllers/admin/banner.js';
import {
  matchedUsers,
  getDeniedRequests,
  handleChatMessage,
  profileMatching,
  receiveRequests,
  sendRequest,
  getChatMessages,
  updateRequestStatus,
} from '../controllers/user/couples.js';
import { addGallery, deleteImage, getGallery } from '../controllers/user/gallery.js';
import { addReview, listReviews } from '../controllers/user/review.js';
import {
  getFilteredUsers,
  getRecommendedProfiles,
  editUser,
  addEnquiry,
  preference,
  getMatchingProfiles,
  updateUserProfile,
  viewProfile,
  viewUserProfile,
  getPreferences,
  getAllUserProfile,
} from '../controllers/user/users.js';

import { fetchMessages, sendMessage } from '../controllers/user/chat.js';
import { CreateGalloticBanners, deleteGalloticBanner, getGalloticBanner } from '../controllers/user/GalloticBanner.js';
const router = express.Router();
// request
router.get('/listBanners', getAllBanners);

router.post('/sendrequest', isUser, sendRequest);
router.get('/receive-requests', isUser, receiveRequests);
router.post('/update-request-status', isUser, updateRequestStatus);
router.get('/matched-users', isUser, matchedUsers);
router.get('/getDeniedRequests', isUser, getDeniedRequests);
router.get('/getChatMessages', isUser, getChatMessages);
//Plans
router.get('/listplan', listPlan);
router.post('/buyPlan', isUser, buyPlan);
router.post('/createOrder', isUser, CreateOrder);
router.get('/userPlan', isUser, userSubscription);
//profile matching
router.post('/profileMatching', isUser, profileMatching);
router.post('/getFilteredUsers', isUser, getFilteredUsers);

//edit profile
router.put('/edit-profile', isUser, editUser);
//chat
router.post('/startMessage', isUser, handleChatMessage);
//Enguire
router.post('/addEnquiry', isUser, addEnquiry);
//Preferences
router.post('/add-preference', isUser, preference);
router.get('/get-preferences', isUser, getPreferences);
router.get('/matches', isUser, getMatchingProfiles);
router.get("/getAllUserProfile",getAllUserProfile)
//recommendation
router.get('/recommendedProfiles', isUser, getRecommendedProfiles);
//edit profile
router.post('/updateUserProfile', isUser, updateUserProfile);
router.get('/viewProfile', isUser, viewProfile);
router.get('/viewUserProfile/:userId', viewUserProfile);
//add Galary
router.post('/addGallery', isUser, addGallery);
router.get('/gallery', isUser, getGallery);
router.delete('/deleteimage/:index', isUser, deleteImage);
router.post('/CreateOrder', isUser, CreateOrder);
//add reviews
router.post('/addReview', isUser, addReview);

router.post('/addGalloticBanner',CreateGalloticBanners)
router.get('/getGalloticBanner',getGalloticBanner)
router.delete('/deleteGalloticBanner/:id',deleteGalloticBanner)

// chat
router.get('/fetchMessages/:toUser', isUser, fetchMessages);
router.post('/sendMessages', isUser, sendMessage);

export default router;
