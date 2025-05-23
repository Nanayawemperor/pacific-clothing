const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb
    .getDatabase()
    .db()
    .collection('employees')
    .find();
    result.toArray().then((employees) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(employees);
    });
};

const getSingle = async (req, res) => {
    const employeeId = new ObjectId(req.params.id);
    const result = await mongodb
    .getDatabase()
    .db()
    .collection('employees')
    .find({ _id: employeeId});
    result.toArray().then((employees) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(employees[0]);
    })
  ;
};

const createEmployee = async (req, res) => {
    //swagger.tags=['employees']
    const employee = {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        hireDate: req.body.hireDate,
        department: req.body.department,
        employmentStatus: req.body.employmentStatus,
        role: req.body.role,
        address: req.body.address
    }
    const response = await mongodb.getDatabase().db().collection('employees').insertOne(employee);
    if (response.acknowledged > 0) {
        return res.status(204);
    }
    else {
        res.status(500).json(response.error || 'Some error occured while updating the employee.');
    }
};

const updateEmployee = async (req, res) => {
    //swagger.tags=['employees']
    const employeeId = new ObjectId(req.params.id);
    const employee = {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        hireDate: req.body.hireDate,
        department: req.body.department,
        employmentStatus: req.body.employmentStatus,
        role: req.body.role,
        address: req.body.address
    }
    const response = await mongodb.getDatabase().db().collection('employees').replaceOne({_id: employeeId}, employee);
    if (response.modifiedCount > 0) {
        return res.status(204);
    }
    else {
        res.status(500).json(response.error || 'Some error occured while updating the employee.');
    }
};


const deleteEmployee = async (req, res) => {
    try {
      const employeeId = new ObjectId(req.params.id);
      const response = await mongodb.getDatabase().db().collection('employees').deleteOne({ _id: employeeId });
  
      if (response.deletedCount > 0) {
        return res.status(204).send(); // ✅ Send proper response and return
      } else {
        return res.status(404).json({ message: 'employee not found.' });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Some error occurred while deleting the employee.' });
    }
}


module.exports = {
    getAll,
    getSingle,
    createEmployee,
    updateEmployee,
    deleteEmployee
}
