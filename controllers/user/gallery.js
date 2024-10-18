import { UserDetails } from '../../model/index.js';
import { validationErrorHandler } from '../../helper/validation-error-handler.js';

export const addGallery = async (req, res, next) => {
  validationErrorHandler(req, next);
  const userId = req.userId;
  if (!req.files || !req.files.image) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    return next(error);
  }

  const image = req.files.image;
  
  const imagePath = image[0].path;
  try {
    const user = await UserDetails.findOne({ where: { userId: userId } });
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    let currentGallery = user.gallery ? JSON.parse(user.gallery) : [];
    
    currentGallery.push(imagePath);

    await UserDetails.update(
      { gallery:currentGallery},
      { where: { userId: userId } }
    );
    
    return res.status(201).json({
      message: 'Image Uploaded successfully😊',
      gallery: currentGallery,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};




export const getGallery = async (req, res, next) => {
  validationErrorHandler(req, next);
  const userId = req.userId;
  try {
    // Create a new gallery entry
    let mygallery = await UserDetails.findOne({
      where: { userId },
      attributes: ['gallery'],
    });

    return res.status(200).json(mygallery);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


export const deleteImage = async (req, res, next) => {
  validationErrorHandler(req, next);
  const userId = req.userId;
  const { index } = req.params;

  try {
  
    const user = await UserDetails.findOne({ where: { userId: userId } });
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    
    let currentGallery = user.gallery ? JSON.parse(user.gallery) : [];
    
    if (index < 0 || index >= currentGallery.length) {
      const error = new Error('Invalid index');
      error.statusCode = 400;
      return next(error);
    }
    const deletedGalleryImage = currentGallery.filter((_, i) => i !== parseInt(index, 10));
    await UserDetails.update(
      { gallery: deletedGalleryImage },
      { where: { userId: userId } }
    );
    
    return res.status(200).json({
      message: 'Image deleted successfully😊',
      gallery: deletedGalleryImage,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
