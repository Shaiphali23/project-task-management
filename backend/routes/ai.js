const express = require('express');
const router = express.Router();
const controller = require('../controllers/aiController');


router.post('/summarize', controller.summarizeProject);
router.post('/qa', controller.qaOnCard);


module.exports = router;