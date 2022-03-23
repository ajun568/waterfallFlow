const { exec } = require('./mysql');

const getList = (pageNum, pageSize) => {
  let sql = `SELECT id, title, image_url, size, width, height FROM wallhaven WHERE size3='K' AND size2<200 LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`;
  return exec(sql);
}

module.exports = { getList };
