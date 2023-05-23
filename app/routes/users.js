const jwt = require('koa-jwt');
const Router = require('koa-router');

const router = new Router({prefix: '/users'});
const userCtl = require('../controller/users');
const {secret} = require('../config');

const auth = jwt({secret});

router.post('/login', userCtl.login);
router.get('/', userCtl.findAll);
router.get('/:id', userCtl.findById);
router.post('/', userCtl.create);
router.patch('/:id', auth, userCtl.checkOwner, userCtl.update);  // put整体替换，patch部分替换
router.delete('/:id', auth, userCtl.checkOwner, userCtl.del);
router.get('/:id/following', userCtl.listFollowing);
router.get('/:id/followers', userCtl.listFollowers);
router.put('/following/:id', auth, userCtl.checkUserExist, userCtl.follow);
router.delete('/following/:id', auth, userCtl.checkUserExist, userCtl.unfollow);

module.exports = router; 