const express = require('express');
const router = express.Router();
const {verifyJwt} = require('../middlewares/authMiddleware');
const {createAsset, getAllAssets} = require('../controller/assetCtrl')


router.post('/create', createAsset);
router.get('/all',verifyJwt, getAllAssets);

module.exports = router;