import { validationErrorHandler } from '../../helper/validation-error-handler.js';
import {
  MatchRequest,
  User,
  Couples,
  ChatMessage,
  UserDetails,
} from '../../model/index.js';
import { Op, where } from 'sequelize';

export const addCouples = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { aboutUs, groomName, brideName } = req.body;

  if (!req.files || !req.files.image) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    return next(error);
  }
  const image = req.files.image;
  try {
    const CouplesData = await Couples.create({
      groomName,
      brideName,
      aboutUs,
      image: image,
    });

    return res.status(201).json({
      CouplesData: CouplesData,
      message: 'Couples data submitted successfully😊',
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


export const deleteCouple = async (req, res, next) => {
  const { id } = req.params;
  try {
    const couple = await Couples.findByPk(id);
    if (!couple) {
      const error = new Error('couple not found');
      error.statusCode = 404;
      return next(error);
    }
     await couple.destroy();
    return res.status(200).json({ message: 'couple deleted successfully' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const updatCouple=async (req,res,next)=>{
  const {id}=req.params;
  const { aboutUs, groomName, brideName } = req.body;
 
  try {
      let couple=await Couples.findByPk(id);
      if(!couple){
        res.status(404).json({message:"Couple not found"})
      }
      let image="";
      if(req.file || req.files.image){
        image=req.files.image;
      }else{
        image=couple.image;
      }
      
      await Couples.update({
        groomName,
        brideName,
        aboutUs,
        image: image,
      },{where:{id:req.params.id}})

      res.status(200).json({ message: 'plan Updated!' });

  } catch (error) {
    if(!error.statusCode){
      error.statusCode=500;
    }
    next(error);
  }
}

export const getCouplesList = async (req, res, next) => {
  try {
    const couplesList = await Couples.findAll();
    if (!couplesList) {
      const error = new Error('No couples found');
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      couples: couplesList,
      message: 'Couples list retrieved successfully😊',
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const handleChatMessage = async (req, res, io) => {
  const { fromUser, toUser, message } = req.body;

  try {
    const newChatMessage = await ChatMessage.create({
      fromUser,
      toUser,
      message,
    });
    io.emit('chat message', {
      fromUser: newChatMessage.fromUser,
      toUser: newChatMessage.toUser,
      message: newChatMessage.message,
      timestamp: newChatMessage.createdAt,
    });

    // Send a response back to the client
    return res
      .status(201)
      .json({ message: 'Message sent', chatMessage: newChatMessage });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occurred while sending the message' });
  }
};

export const sendRequest = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const { toUserId } = req.body;
    const fromUserId = req.userId;

    // Check if both users exist
    const fromUser = await User.findOne({ where: { id: fromUserId } });
    const toUser = await User.findOne({ where: { id: toUserId } });

    if (!fromUser) {
      const error = new Error('Sender not found');
      error.statusCode = 404;
      return next(error);
    }

    if (!toUser) {
      const error = new Error('Receiver not found');
      error.statusCode = 404;
      return next(error);
    }

    // Check if a request already exists between these users
    const existingRequest = await MatchRequest.findOne({
      where: {
        fromUserId,
        toUserId,
        status: {
          [Op.in]: ['pending', 'accepted'],
        },
      },
    });

    if (existingRequest) {
      const message =
        existingRequest.status === 'pending'
          ? 'Request already sent'
          : 'Request already accepted';
      return res.status(400).json({
        message,
      });
    }

    // Create the request
    await MatchRequest.create({
      fromUserId,
      toUserId,
      UserId: toUserId,
      status: 'pending',
    });

    return res.status(200).json({
      message: 'Request sent successfully',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

export const receiveRequests = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const userId = req.userId;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // Fetch only pending requests
    const matchUsers = await MatchRequest.findAll({
      where: {
        toUserId: userId,
        status: 'pending',
      },
      include: [
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'firstName', 'email'],
          include: [
            {
              model: UserDetails,
              as: 'details',
              attributes: [
                'profilePhoto',
                'residingCity',
                'age',
                'Occupation',
                'height',
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json(matchUsers);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
export const updateRequestStatus = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const { fromUserId, status } = req.body;
    const toUserId = req.userId;

    // Find the match request between the fromUserId and toUserId
    const request = await MatchRequest.findOne({
      where: { fromUserId, toUserId },
    });

    if (!request) {
      const error = new Error('Request not found');
      error.statusCode = 404;
      return next(error);
    }

    // Check if the request status is already 'accepted' or 'rejected'
    if (request.status === 'accepted' || request.status === 'rejected') {
      const error = new Error('Request has already been processed');
      error.statusCode = 400;
      return next(error);
    }

    // Update the status and save the instance
    request.status = status;
    await request.save();  // Corrected here to call save() on the instance

    res.status(200).json({
      message: 'Request status updated successfully',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const matchedUsers = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    // Check if the user exists
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    const matchedUsers = await MatchRequest.findAll({
      where: {
        toUserId: req.userId,
        status: 'accepted',
      },
      include: [
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'firstName', 'email'],
          include: [
            {
              model: UserDetails,
              as: 'details',
              attributes: [
                'profilePhoto',
                'residingCity',
                'age',
                'Occupation',
                'height',
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json(matchedUsers);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

export const getDeniedRequests = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    const rejectedRequests = await MatchRequest.findAll({
      where: {
        toUserId: userId,
        status: 'rejected',
      },
    });

    return res.status(200).json(rejectedRequests);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
export const profileMatching = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const { userId } = req.body;

    // Find the user making the request
    const user = await AdvancedBio.findOne({
      where: { userId },
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // Determine the target gender for matching
    const targetGender = user.gender === 'male' ? 'female' : 'male';

    const dateOfBirth = new Date(user.dateofbirth);
    const minDateOfBirth = new Date(
      dateOfBirth.getFullYear() - 2,
      dateOfBirth.getMonth(),
      dateOfBirth.getDate(),
    );
    const maxDateOfBirth = new Date(
      dateOfBirth.getFullYear() + 2,
      dateOfBirth.getMonth(),
      dateOfBirth.getDate(),
    );

    // Find matching profiles based on criteria
    const matchingProfiles = await AdvancedBio.findAll({
      where: {
        gender: targetGender,
        // dateofbirth: {
        //   [Op.between]: [minDateOfBirth, maxDateOfBirth]
        // },
      },
    });

    return res.status(200).json({
      message: 'Matching profiles found',
      profiles: matchingProfiles,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

export const getChatMessages = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const { userId } = req;

    // Check if the user exists
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // Fetch accepted requests where the user is either the sender or receiver
    const acceptedRequests = await MatchRequest.findAll({
      where: {
        [Op.or]: [
          { fromUserId: userId, status: 'accepted' },
          { toUserId: userId, status: 'accepted' },
        ],
      },
      include: [
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'firstName', 'email'],
        },
        {
          model: User,
          as: 'toUser',
          attributes: ['id', 'firstName', 'email'],
        },
      ],
    });

    // Extract the list of unique accepted user IDs
    const acceptedUserIds = [];
    acceptedRequests.forEach(request => {
      if (request.fromUserId !== userId) {
        acceptedUserIds.push(request.fromUserId);
      }
      if (request.toUserId !== userId) {
        acceptedUserIds.push(request.toUserId);
      }
    });

    // Fetch user details for the accepted users
    const chatUsers = await User.findAll({
      where: { id: { [Op.in]: acceptedUserIds } },
      attributes: ['id', 'firstName', 'email'],
      include: [
        {
          model: UserDetails,
          as: 'details',
          attributes: [
            'profilePhoto',
            'residingCity',
            'age',
            'Occupation',
            'height',
          ],
        },
      ],
    });

    // Structure the response
    const response = chatUsers.map(chatUser => {
      const userDetails = chatUser.details || {};

      return {
        id: chatUser.id,
        firstName: chatUser.firstName,
        email: chatUser.email,
        profilePhoto: userDetails.profilePhoto || '',
        city: userDetails.residingCity || '',
        age: userDetails.age || '',
        occupation: userDetails.Occupation || '',
        height: userDetails.height || '',
      };
    });

    return res.status(200).json(response);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
