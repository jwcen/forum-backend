const Router = require('koa-router');
const jwt = require('koa-jwt');
const TopicsCtl = require('../controller/topics');
const {secret} = require('../config');

const auth = jwt({secret});
const router = new Router({prefix: '/topics'});

router.get('/', TopicsCtl.find);
router.get('/:id', TopicsCtl.findById);
router.post('/', auth, TopicsCtl.add);
router.put('/:id', TopicsCtl.update);

module.exports = router;