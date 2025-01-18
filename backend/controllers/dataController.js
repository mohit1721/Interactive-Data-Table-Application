// controllers/dataController.js

const dataFile = require("../data.json"); // Import the data file

exports.getData = (req, res) => {
  const { page = 1, rowsPerPage = 10, search = "", sortBy = "Domain", order = "asc" } = req.query;

  // Parse the data array
  const rawData = dataFile.Sheet1 || [];

  // Apply search filter
  let filteredData = rawData.filter((item) =>
    item.Domain.toLowerCase().includes(search.toLowerCase())
  );

  // Sort data
  filteredData = filteredData.sort((a, b) => {
    const valueA = a[sortBy] || "";
    const valueB = b[sortBy] || "";
    if (order === "asc") {
      return isNaN(valueA) ? valueA.localeCompare(valueB) : valueA - valueB;
    } else {
      return isNaN(valueB) ? valueB.localeCompare(valueA) : valueB - valueA;
    }
  });

  // Paginate data
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + Number(rowsPerPage));

  // Respond with filtered, sorted, and paginated data
  res.json({
    success: true,
    total: filteredData.length,
    totalPages: Math.ceil(filteredData.length / Number(rowsPerPage)), // Total pages
    currentPage: Number(page), // Current page
    rowsPerPage: Number(rowsPerPage),
    data: paginatedData,
    alldata: rawData,
  });
};
