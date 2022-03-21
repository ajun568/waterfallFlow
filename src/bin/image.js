const router = require('koa-router')();
const { getList } = require('./controller');
router.prefix('/api/image');

router.get('/list', async (ctx, next) => {
  const pageSize = ctx.query.pageSize || 100;
  const pageNum = ctx.query.pageNum + 1 || 1;
  const result = await getList(pageNum, pageSize);
  if (typeof result === 'string') {
    ctx.body = {
      err_no: -1,
      message: result,
      data: null,
    };
  } else {
    ctx.body = {
      err_no: 0,
      message: 'Successful',
      data: result,
    };
  }
});

module.exports = router;
