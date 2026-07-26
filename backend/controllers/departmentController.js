const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    res.status(200).json({ success: true, count: departments.length, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all departments (including inactive, Admin only)
// @route   GET /api/departments/all
// @access  Private/Admin
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json({ success: true, count: departments.length, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
exports.getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private/Admin/Coordinator
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, category, description } = req.body;

    // Check code/name uniqueness
    const codeExists = await Department.findOne({ code: code.toUpperCase() });
    if (codeExists) {
      return res.status(400).json({ success: false, message: 'Department code already exists' });
    }

    const nameExists = await Department.findOne({ name });
    if (nameExists) {
      return res.status(400).json({ success: false, message: 'Department name already exists' });
    }

    const department = await Department.create({
      name,
      code,
      category,
      description,
    });

    res.status(201).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin/Coordinator
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const { name, code, category, description, isActive } = req.body;

    if (name) department.name = name;
    if (code) department.code = code.toUpperCase();
    if (category) department.category = category;
    if (description) department.description = description;
    if (isActive !== undefined) department.isActive = isActive;

    await department.save();

    res.status(200).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    // Set references in users to null
    await User.updateMany({ department: department._id }, { $set: { department: null } });

    await department.deleteOne();

    res.status(200).json({ success: true, message: 'Department deleted and references removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
