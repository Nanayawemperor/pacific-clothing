const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Joi = require('joi');

const departmentSchema = Joi.object({
    departmentName : Joi.string().required(),
    manager: Joi.string().required(),
    totalEmployees: Joi.number().integer().min(0).required(),
    location: Joi.string().required()
})

const getAll = async (req, res) => {
  try{
      const departments = await mongodb.getDatabase().db().collection('departments').find().toArray();
  res.status(200).json(departments);
  }
  catch (error) {
    res.status(500).json({message: 'Internal server error', error});
  }
};

const getSingle = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid department ID.' });
  }
  try {
    const departmentId = new ObjectId(req.params.id);
    const department = await mongodb.getDatabase().db().collection('departments').findOne({ _id: departmentId });
    if (!department) return res.status(404).json({ message: 'Department not found.' });
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const createDepartment = async (req, res) => {
  const { error, value } = departmentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const response = await mongodb.getDatabase().db().collection('departments').insertOne(value);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Department created successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to create department.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};

const updateDepartment = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid department ID.' });
  }

  const { error, value } = departmentSchema.validate(req.body, { presence: 'optional' });
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const departmentId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('departments').updateOne(
      { _id: departmentId },
      { $set: value }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    res.status(200).json({ message: 'Department updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};

const deleteDepartment = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid department ID.' });
  }

  try {
    const departmentId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('departments').deleteOne({ _id: departmentId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    res.status(200).json({ message: 'Department deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};

module.exports = {
  getAll,
  getSingle,
  createDepartment,
  updateDepartment,
  deleteDepartment
};