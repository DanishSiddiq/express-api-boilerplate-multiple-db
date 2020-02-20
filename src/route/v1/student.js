import express from 'express';
import studentController from '../../controllers/student.ctrl';

const router = express.Router();

router.post('/student', studentController.createOne);

module.exports = router;
