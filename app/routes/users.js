const Router = require('koa-router');
const router = new Router({ prefix: '/users' });

const userCtl = require('../controller/users');

router.get('/', userCtl.findAll);
router.get('/:id', userCtl.findById);
router.post('/', userCtl.create);
router.put('/:id', userCtl.update);
router.delete('/:id', userCtl.del);

module.exports = router; 