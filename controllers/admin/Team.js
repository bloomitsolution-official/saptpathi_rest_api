import { Banner } from '../../model/index.js';
import { validationErrorHandler } from '../../helper/validation-error-handler.js';
import Team from '../../model/team.js';
export const CreateTeam = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { name, position, } = req.body;
  try {
    if (!req.files.image) {
      const error = new Error('No Image provided');
      error.statusCode = 422;
      return next(error);
    }
    const imageUrls = req.files.image;

    await Team.create({
        name,
        position,
        imageUrls,
      isActive: true,
    });

    res.status(201).json({
      message: 'Team Member Created successfully',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

export const getAllTeamMember = async (req, res, next) => {
  try {
    const teammembers = await Team.findAll({
      where: {
        isActive: true,
      },
    });
    if (!teammembers) {
      const error = new Error('Team Member not found');
      error.statusCode = 404;
      return next(error);
    }
    return res.status(200).json(teammembers);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const deleteTeamMember = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teamMember = await Team.findByPk(id);
    if (!teamMember) {
      const error = new Error('Team Member Not Found');
      error.statusCode = 404;
      return next(error);
    }
    teamMember.isActive = false;
    teamMember.save();
    return res.status(200).json({ message: 'Team Member deleted successfully' });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
