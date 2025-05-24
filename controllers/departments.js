const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const departments = await mongodb
      .getDatabase()
      .db()
      .collection('departments')
      .find()
      .toArray();

    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch department.' });
  }
};

const getSingle = async (req, res) => {
  try {
    const departmentId = new ObjectId(req.params.id);
    const department = await mongodb
      .getDatabase()
      .db()
      .collection('departments')
      .findOne({ _id: departmentId });

    if (!department) {
      return res.status(404).json({ message: 'department not found.' });
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
        name: req.body.name,
        manager: req.body.manager,
        totalEmployees: req.body.totalEmployees,
        location: req.body.location,
    };

    const response = await mongodb.getDatabase().db().collection('departments').insertOne(department);

    if (response.acknowledged) {
      // Return created department with 201 status
      const createdDepartment = await mongodb.getDatabase().db().collection('departments').findOne({ _id: response.insertedId });
      return res.status(201).json(createDepartment);
    } else {
      return res.status(500).json({ message: 'Failed to create department.' });
    }
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Failed to create department.' });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const departmentId = new ObjectId(req.params.id);
    const department = {
        name: req.body.name,
        manager: req.body.manager,
        totalEmployees: req.body.totalEmployees,
        location: req.body.location,
    };

    const response = await mongodb.getDatabase().db().collection('departments').replaceOne({ _id: departmentId }, department);

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'department not found.' });
    }

    if (response.modifiedCount > 0) {
      return res.status(200).json({ message: 'department updated successfully.' });
    } else {
      return res.status(200).json({ message: 'No changes made to employee.' });
    }
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Failed to update department.' });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const departmentId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('departments').deleteOne({ _id: departmentId });

    if (response.deletedCount > 0) {
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: 'department not found.' });
    }
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Failed to delete department.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};