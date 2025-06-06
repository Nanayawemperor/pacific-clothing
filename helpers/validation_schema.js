const Joi = require('@hapi/joi');

const departmentSchema = Joi.object({
    departmentName : Joi.string().required(),
    manager: Joi.string().required(),
    totalEmployees: Joi.number().integer().min(0).required(),
    location: Joi.string().required()
})

const employeesSchema = Joi.object({
    fullName: Joi.string().required(),
    phoneNumber: Joi.number().integer().required(),
    hireDate: Joi.date().required(),
    department: Joi.string().required(),
    employmentStatus: Joi.string().required(),
    role: Joi.string().required(),
    address: Joi.string().required()
})

module.exports = {
    departmentSchema,
    employeesSchema
}