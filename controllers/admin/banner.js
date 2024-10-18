import { Banner } from '../../model/index.js';
import { validationErrorHandler } from '../../helper/validation-error-handler.js';
export const CreateBanners = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { title, position } = req.body;
  try {
    if (!req.files.banner) {
      const error = new Error('No banner provided');
      error.statusCode = 422;
      return next(error);
    }
    const imageUrls = req.files.banner;

    await Banner.create({
      title,
      position,
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

export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.findAll({
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

export const deleteBanner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findByPk(id);
    if (!banner) {
      const error = new Error('Banners not found');
      error.statusCode = 404;
      return next(error);
    }
    banner.isActive = false;
    banner.save();
    return res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
