import { Plan } from '../../model/index.js';
import { validationErrorHandler } from '../../helper/validation-error-handler.js';

// CREATE endpoint
export const createPlan = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { name, amount, planValidity, planType, features } = req.body;
  try {
    const existingPlan = await Plan.findOne({
      where: {
        name,
        isActive: true,
      },
    });
    if (existingPlan) {
      return res.status(400).json({ message: 'Plan already exists' });
    }
    const newPlan = await Plan.create({
      name,
      amount,
      planType,
      planValidity,
      features,
      isActive: true,
    });
    return res.status(201).json({
      message: 'Plan Created Successfully',
      planId: newPlan.id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const listPlan = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const plan = await Plan.findAll({
      where: {
        isActive: true,
      },
    });
    res.status(200).json(plan);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// UPDATE endpoint
export const updatePlan = async (req, res, next) => {
  validationErrorHandler(req, next);
  const { name, amount, planValidity, features } = req.body;

  try {
    const plans = await Plan.findByPk(req.params.id);
    if (!plans) {
      res.status(404).json({ message: 'Plan not found' });
    }
    await Plan.update(
      {
        name,
        amount,
        planValidity,
        features,
      },
      { where: { id: req.params.id } },
    );
    res.status(200).json({ message: 'plan Updated!' });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

// DELETE endpoint
export const deletePlan = async (req, res, next) => {
  validationErrorHandler(req, next);
  try {
    const plans = await Plan.findByPk(req.params.id);
    if (!plans) {
      res.status(404).json({ message: 'Package not found' });
    }
    plans.isActive = false;
    plans.save();
    res.status(200).json({
      message: 'Plan deactiave successfully',
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
