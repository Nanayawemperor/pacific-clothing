const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Joi = require('joi');
const createError = require('http-errors'); // ✅ Import http-errors

// ✅ JOI schema
const departmentSchema = Joi.object({
  departmentName: Joi.string().required(),
  manager: Joi.string().required(),
  totalEmployees: Joi.number().integer().min(0).required(),
  location: Joi.string().required()
});

// ✅ Get all departments
const getAll = async (req, res, next) => {
  try {
    const departments = await mongodb.getDatabase().db().collection('departments').find().toArray();
    res.status(200).json(departments);
  } catch (error) {
    next(createError(500, 'Internal server error'));
  }
};

// ✅ Get single department
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return next(createError(400, 'Invalid department ID.'));
  }

  try {
    const departmentId = new ObjectId(req.params.id);
    const department = await mongodb.getDatabase().db().collection('departments').findOne({ _id: departmentId });
    if (!department) return next(createError(404, 'Department not found.'));
    res.status(200).json(department);
  } catch (error) {
    next(createError(500, 'Internal server error'));
  }
};

// ✅ Create a new department
const createDepartment = async (req, res, next) => {
  const { error, value } = departmentSchema.validate(req.body);
  if (error) return next(createError(400, error.details[0].message));

  try {
    const response = await mongodb.getDatabase().db().collection('departments').insertOne(value);
    if (!response.acknowledged) {
      return next(createError(500, 'Failed to create department.'));
    }
    res.status(201).json({ message: 'Department created successfully.', id: response.insertedId });
  } catch (err) {
    next(createError(500, 'Internal server error'));
  }
};

// ✅ Update department
const updateDepartment = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return next(createError(400, 'Invalid department ID.'));
  }

  const { error, value } = departmentSchema.validate(req.body, { presence: 'optional' });
  if (error) return next(createError(400, error.details[0].message));

  try {
    const departmentId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('departments').updateOne(
      { _id: departmentId },
      { $set: value }
    );

    if (response.matchedCount === 0) {
      return next(createError(404, 'Department not found.'));
    }

    res.status(200).json({ message: 'Department updated successfully.' });
  } catch (err) {
    next(createError(500, 'Internal server error'));
  }
};

// ✅ Delete department
const deleteDepartment = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return next(createError(400, 'Invalid department ID.'));
  }

  try {
    const departmentId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('departments').deleteOne({ _id: departmentId });

    if (response.deletedCount === 0) {
      return next(createError(404, 'Department not found.'));
    }

    res.status(200).json({ message: 'Department deleted successfully.' });
  } catch (err) {
    next(createError(500, 'Internal server error'));
  }
};

module.exports = {
  getAll,
  getSingle,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
