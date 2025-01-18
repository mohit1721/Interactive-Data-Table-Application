const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const dataFile = require("./data.json"); // Load JSON data
const cookieParser = require("cookie-parser");
const authRoute = require('./routes/authRoute');
const dataRoutes = require("./routes/dataRoutes"); // Import the routes
const database = require("./db/database");

const app = express();
const PORT = 5000;
dotenv.config();//load dotenv config
database.connect();//
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
    cors({
      origin: process.env.NODE_ENV === 'production' 
        ? "https://interactive-data-fe.vercel.app" 
        : "http://localhost:3000", // Conditional origin based on environment
  
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  
      allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  
      credentials: true, // Allows cookies and authentication credentials
    })
  );
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000' , 'https://interactive-data-fe.vercel.app'); 
    // console.log(req.headers); // Check what headers are being passed
  
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });
// Endpoint to fetch paginated, sorted, and filtered data
// app.get("/data", (req, res) => {
//   const { page = 1, rowsPerPage = 10, search = "", sortBy = "Domain", order = "asc" } = req.query;

//   // Parse the data array
//   const rawData = dataFile.Sheet1 || [];
// //   console.log("Query Params:", req.query);

//   // Apply search filter
//   let filteredData = rawData.filter((item) =>
//     item.Domain.toLowerCase().includes(search.toLowerCase())
//   );
// // const totalEntries = filteredData.length
//   // Sort data
//   //  filteredData = filteredData.sort((a, b) => {
//   //   if (order === "asc") {
//   //     return isNaN(a[sortBy]) ? a[sortBy].localeCompare(b[sortBy]) : a[sortBy] - b[sortBy];
//   //   } else {
//   //     return isNaN(a[sortBy]) ? b[sortBy].localeCompare(a[sortBy]) : b[sortBy] - a[sortBy];
//   //   }
//   // });
//   filteredData = filteredData.sort((a, b) => {
//     const valueA = a[sortBy] || "";
//     const valueB = b[sortBy] || "";
//     if (order === "asc") {
//       return isNaN(valueA) ? valueA.localeCompare(valueB) : valueA - valueB;
//     } else {
//       return isNaN(valueB) ? valueB.localeCompare(valueA) : valueB - valueA;
//     }
//   });
//   // Paginate data
//   const startIndex = (page - 1) * rowsPerPage;
//   const paginatedData = filteredData.slice(startIndex, startIndex + Number(rowsPerPage));
// //   console.log("Query Params:", req.query);
// //   console.log("Filtered Data Count:", filteredData.length);
// //   console.log("Sorted Data Count:", sortedData.length);
// //   console.log("Paginated Data Count:", paginatedData);
  
//   // Respond with filtered, sorted, and paginated data
//   res.json({
//     success: true,
//     total: filteredData.length,
//     totalPages: Math.ceil(filteredData.length / Number(rowsPerPage)), // Total pages based on rows per page
//     currentPage: Number(page), // Current page
//     rowsPerPage: Number(rowsPerPage),
//     data: paginatedData,
//     alldata:rawData,
//   });
// });
//. routes mount..
app.use("/api/v1/auth", authRoute);
// Use routes
app.use("/api/v1", dataRoutes); // Prefix with "/api" for all routes in dataRoutes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
