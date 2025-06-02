const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const employees = await mongodb
      .getDatabase()
      .db()
      .collection('employees')
      .find()
      .toArray();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees.' });
  }
};

const getSingle = async (req, res) => {
  try {
    const employeeId = new ObjectId(req.params.id);
    const employee = await mongodb
      .getDatabase()
      .db()
      .collection('employees')
      .findOne({ _id: employeeId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Failed to fetch employee.' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employee = {
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      hireDate: req.body.hireDate,
      department: req.body.department,
      employmentStatus: req.body.employmentStatus,
      role: req.body.role,
      address: req.body.address,
    };
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('employees')
      .insertOne(employee);
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
  try {
    const employeeId = new ObjectId(req.params.id);
    const updates = {};
    // Only set fields that are provided in req.body
    ['fullName', 'phoneNumber', 'hireDate', 'department', 'employmentStatus', 'role', 'address'].forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('employees')
      .updateOne({ _id: employeeId }, { $set: updates });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    if (response.modifiedCount > 0) {
      return res.status(200).json({ message: 'Employee updated successfully.' });
    } else {
      return res.status(200).json({ message: 'No changes made to employee.' });
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Failed to update employee.' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employeeId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('employees')
      .deleteOne({ _id: employeeId });

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
  deleteEmployee,
};

