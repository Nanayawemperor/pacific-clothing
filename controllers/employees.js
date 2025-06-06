const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Joi = require('joi');
const createError = require('http-errors');

// Joi schema for employee
const employeesSchema = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: Joi.number().integer().required(),
  hireDate: Joi.date().required(),
  department: Joi.string().required(),
  employmentStatus: Joi.string().required(),
  role: Joi.string().required(),
  address: Joi.string().required()
});

const getAll = async (req, res, next) => {
  try {
    const employees = await mongodb.getDatabase().db().collection('employees').find().toArray();
    res.status(200).json(employees);
  } catch (error) {
    next(createError(500, 'Failed to fetch employees'));
  }
};

const getSingle = async (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return next(createError(400, 'Invalid employee ID.'));

  try {
    const employeeId = new ObjectId(id);
    const employee = await mongodb.getDatabase().db().collection('employees').findOne({ _id: employeeId });

    if (!employee) return next(createError(404, 'Employee not found.'));
    res.status(200).json(employee);
  } catch (error) {
    next(createError(500, 'Failed to fetch employee.'));
  }
};

const createEmployee = async (req, res, next) => {
  const { error, value } = employeesSchema.validate(req.body);
  if (error) return next(createError(400, error.details[0].message));

  try {
    const response = await mongodb.getDatabase().db().collection('employees').insertOne(value);
    if (!response.acknowledged) throw createError(500, 'Failed to create employee.');

    res.status(201).json({ message: 'Employee created successfully.', id: response.insertedId });
  } catch (err) {
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return next(createError(400, 'Invalid employee ID.'));

  const { error, value } = employeesSchema.validate(req.body, { presence: 'optional' });
  if (error) return next(createError(400, error.details[0].message));

  try {
    const employeeId = new ObjectId(id);
    const response = await mongodb.getDatabase().db().collection('employees').updateOne(
      { _id: employeeId },
      { $set: value }
    );

    if (response.matchedCount === 0) return next(createError(404, 'Employee not found.'));

    const message = response.modifiedCount > 0
      ? 'Employee updated successfully.'
      : 'No changes made to employee.';

    res.status(200).json({ message });
  } catch (error) {
    next(createError(500, 'Failed to update employee.'));
  }
};

const deleteEmployee = async (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return next(createError(400, 'Invalid employee ID.'));

  try {
    const employeeId = new ObjectId(id);
    const response = await mongodb.getDatabase().db().collection('employees').deleteOne({ _id: employeeId });

    if (response.deletedCount === 0) return next(createError(404, 'Employee not found.'));
    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    next(createError(500, 'Failed to delete employee.'));
  }
};

module.exports = {
  getAll,
  getSingle,
  createEmployee,
  updateEmployee,
  deleteEmployee
};

