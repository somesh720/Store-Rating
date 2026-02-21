const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generatePagination = (page, limit, total) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  return pagination;
};

const formatRating = (rating) => {
  return parseFloat(rating).toFixed(1);
};

module.exports = {
  hashPassword,
  comparePassword,
  generatePagination,
  formatRating
};