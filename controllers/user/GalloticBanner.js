import { validationErrorHandler } from '../../helper/validation-error-handler.js';
import GalloticsBanner from '../../model/galloticBanner.js';
export const CreateGalloticBanners = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    if (!req.files.banner) {
      const error = new Error('No banner provided');
      error.statusCode = 422;
      return next(error);
    }
    const imageUrls = req.files.banner;

    await GalloticsBanner.create({
      imageUrls,
      isActive: true,
    });

    res.status(201).json({
      message: 'Banner uploaded successfully',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

export const getGalloticBanner = async (req, res, next) => {
  try {
    const banners = await GalloticsBanner.findAll({
      where: {
        isActive: true,
      },
    });
    if (!banners) {
      const error = new Error('Banners not found');
      error.statusCode = 404;
      return next(error);
    }
    return res.status(200).json(banners);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const deleteGalloticBanner = async (req, res, next) => {
  const { id } = req.params;
  console.log("id",id);
  try {
    const Gallotic = await GalloticsBanner.findByPk(id);
    if (!Gallotic) {
      const error = new Error('Banners not found');
      error.statusCode = 404;
      return next(error);
    }
    Gallotic.isActive = false;
    Gallotic.save();
    return res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    if (!error?.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
