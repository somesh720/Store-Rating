const USER_ROLES = {
  ADMIN: 'admin',
  STORE_OWNER: 'store_owner',
  NORMAL_USER: 'normal_user'
};

const RATING_RANGE = {
  MIN: 1,
  MAX: 5
};

const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC'
};

const VALID_SORT_COLUMNS = {
  USERS: ['name', 'email', 'address', 'role'],
  STORES: ['name', 'email', 'address']
};

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;

module.exports = {
  USER_ROLES,
  RATING_RANGE,
  SORT_ORDER,
  VALID_SORT_COLUMNS,
  PASSWORD_REGEX
};