const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const departments = await mongodb.getDatabase().db().collection('departments').find().toArray();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments.' });
  }
};

const getSingle = async (req, res) => {
  try {
    const departmentId = new ObjectId(req.params.id);
    const department = await mongodb.getDatabase().db().collection('departments').findOne({ _id: departmentId });
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    res.status(200).json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Failed to fetch department.' });
  }
};

const createDepartment = async (req, res) => {
  try {
    const department = {
      departmentName: req.body.departmentName,
      manager: req.body.manager,
      totalEmployees: req.body.totalEmployees,
      location: req.body.location,
    };
    const response = await mongodb.getDatabase().db().collection('departments').insertOne(department);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Department created successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to create department.' });
    }
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Failed to create department.', error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const departmentId = new ObjectId(req.params.id);
    const updateFields = {};
    if (req.body.departmentName !== undefined) updateFields.departmentName = req.body.departmentName;
    if (req.body.manager !== undefined) updateFields.manager = req.body.manager;
    if (req.body.totalEmployees !== undefined) updateFields.totalEmployees = req.body.totalEmployees;
    if (req.body.location !== undefined) updateFields.location = req.body.location;

    const response = await mongodb.getDatabase().db().collection('departments').updateOne(
      { _id: departmentId },
      { $set: updateFields }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    res.status(200).json({ message: 'Department updated successfully.' });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Failed to update department.', error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const departmentId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('departments').deleteOne({ _id: departmentId });
    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    res.status(200).json({ message: 'Department deleted successfully.' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Failed to delete department.', error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
