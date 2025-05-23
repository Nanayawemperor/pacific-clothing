const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb
    .getDatabase()
    .db()
    .collection('departments')
    .find();
    result.toArray().then((departments) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(departments);
    });
};

const getSingle = async (req, res) => {
    const employeeId = new ObjectId(req.params.id);
    const result = await mongodb
    .getDatabase()
    .db()
    .collection('departments')
    .find({ _id: departmentId});
    result.toArray().then((departments) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(departments[0]);
    })
  ;
};

const createDepartment = async (req, res) => {
    //swagger.tags=['departments']
    const department = {
        departmentName: req.body.departmentName,
        manager: req.body.manager,
        totalEmployees: req.body.totalEmployees,
        location: req.body.location
    }
    const response = await mongodb.getDatabase().db().collection('departments').insertOne(department);
    if (response.acknowledged > 0) {
        res.status(204);
    }
    else {
        res.status(500).json(response.error || 'Some error occured while updating the department.');
    }
};

const updateDepartment = async (req, res) => {
    //swagger.tags=['departments']
    const departmentId = new ObjectId(req.params.id);
    const department = {
        departmentName: req.body.departmentName,
        manager: req.body.manager,
        totalEmployees: req.body.totalEmployees,
        location: req.body.location
    }
    const response = await mongodb.getDatabase().db().collection('departments').replaceOne({_id: departmentId}, department);
    if (response.modifiedCount > 0) {
        res.status(204);
    }
    else {
        res.status(500).json(response.error || 'Some error occured while updating the department.');
    }
};


const deleteDepartment = async (req, res) => {
    try {
      const departmentId = new ObjectId(req.params.id);
      const response = await mongodb.getDatabase().db().collection('departments').deleteOne({ _id: departmentId });
  
      if (response.deletedCount > 0) {
        return res.status(204).send(); // ✅ Send proper response and return
      } else {
        return res.status(404).json({ message: 'Department not found.' });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Some error occurred while deleting the department.' });
    }
}


module.exports = {
    getAll,
    getSingle,
    createDepartment,
    updateDepartment,
    deleteDepartment
}
