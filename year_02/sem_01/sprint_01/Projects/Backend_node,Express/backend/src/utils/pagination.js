const getPagination = (page = 1, limit = 50) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
  const skip = (parsedPage - 1) * parsedLimit;
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip
  };
};

module.exports = {
  getPagination
};
