const express = require('express');
const router = express.Router();
const controller = require('../controllers/tasksController');


router.post('/', controller.createTask);
router.get('/project/:projectId', controller.getTasksByProject);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);


module.exports = router;