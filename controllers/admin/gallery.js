import { validationErrorHandler } from '../../helper/validation-error-handler.js';
import { Gallery } from '../../model/index.js';
export const addGallery = async (req, res, next) => {
  validationErrorHandler(req, next);

  if (!req.files || !req.files.image) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    return next(error);
  }
  const image = req.files.image;
  try {
    // Create a new gallery entry
    await Gallery.create({
      photos: image,
      isActive: true,
    });

    return res.status(201).json({
      message: 'Gallery created successfully😊',
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
  try {
    // Fetch the gallery entries for the user
    const gallery = await Gallery.findAll({
      where: {
        isActive: true,
      },
    });

    // Check if the gallery exists for the user
    if (!gallery || gallery.length === 0) {
      const error = new Error('Gallery not found');
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json(gallery);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const deleteGallery = async (req, res, next) => {
  const { id } = req.params;
  validationErrorHandler(req, next);
  try {
    const gallery = await Gallery.findByPk(id);
    if (!gallery) {
      const error = new Error('Gallery not found');
      error.statusCode = 404;
      return next(error);
    }
    gallery.isActive = false;
    gallery.save();
    return res
      .status(200)
      .json({ message: 'Gallery Image deleted successfully' });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
