const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Joi = require('joi');

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

const getAll = async (req, res) => {
  try {
    const employees = await mongodb.getDatabase().db().collection('employees').find().toArray();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees.' });
  }
};

const getSingle = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid employee ID.' });

  try {
    const employeeId = new ObjectId(id);
    const employee = await mongodb.getDatabase().db().collection('employees').findOne({ _id: employeeId });

    if (!employee) return res.status(404).json({ message: 'Employee not found.' });
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Failed to fetch employee.' });
  }
};

const createEmployee = async (req, res) => {
  const { error, value } = employeesSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const response = await mongodb.getDatabase().db().collection('employees').insertOne(value);
    if (response.acknowledged) {
      return res.status(201).json({ message: 'Employee created successfully.', id: response.insertedId });
    } else {
      return res.status(500).json({ message: 'Failed to create employee.' });
    }
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Failed to create employee.' });
  }
};

const updateEmployee = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid employee ID.' });

  const { error, value } = employeesSchema.validate(req.body, { presence: 'optional' });
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const employeeId = new ObjectId(id);
    const response = await mongodb.getDatabase().db().collection('employees').updateOne(
      { _id: employeeId },
      { $set: value }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const message = response.modifiedCount > 0
      ? 'Employee updated successfully.'
      : 'No changes made to employee.';

    return res.status(200).json({ message });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Failed to update employee.' });
  }
};

const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid employee ID.' });

  try {
    const employeeId = new ObjectId(id);
    const response = await mongodb.getDatabase().db().collection('employees').deleteOne({ _id: employeeId });

    if (response.deletedCount > 0) {
      return res.status(200).json({ message: 'Employee deleted successfully.' });
    } else {
      return res.status(404).json({ message: 'Employee not found.' });
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Failed to delete employee.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
