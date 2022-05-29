const express = require('express');
const cors = require('cors');
const router = express.Router();
router.use(cors());
const detailsController = require('../controllers/details.controller');

router.get('/:id', cors(), detailsController.getDetailsById);
router.get('/', cors(), detailsController.getAllDetails);
router.post('/add', cors(), detailsController.addDetailsToWareh);
router.put('/', cors(), detailsController.editWarehDetails);
router.delete('/:id', cors(), detailsController.deleteWarehDetails);

module.exports = router;
