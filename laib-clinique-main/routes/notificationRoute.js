const express = require('express');
const { getNonSeenNotifications, markNotificationAsSeen } = require("../controllers/notification");


const router = express.Router();

router.get('/',getNonSeenNotifications)
router.post('/seen/:id',markNotificationAsSeen)


module.exports = router;
