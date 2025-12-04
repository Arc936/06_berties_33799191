const express = require("express")
const router = express.Router()
const request = require('request')


router.get('/books', function (req, res, next) {
  // 1. Get query parameters
    const searchTerm = req.query.search;
    const minPrice = req.query.minprice;
    const maxPrice = req.query.max_price;
    const sortBy = req.query.sort; // <-- NEW: Get the sort parameter

    let sqlquery = "SELECT * FROM books";
    let queryParams = [];
    let conditions = []; // Array to hold individual WHERE clauses

    // --- Search and Price Filtering Logic (Unchanged) ---

    // 2. Add search condition (using the 'name' column)
    if (searchTerm) {
        conditions.push("name LIKE ?"); 
        queryParams.push('%' + searchTerm + '%');
    }

    // 3. Add price range condition
    if (minPrice && maxPrice) {
        conditions.push("price BETWEEN ? AND ?");
        queryParams.push(minPrice);
        queryParams.push(maxPrice);
    } else if (minPrice) {
        conditions.push("price >= ?");
        queryParams.push(minPrice);
    } else if (maxPrice) {
        conditions.push("price <= ?");
        queryParams.push(maxPrice);
    }

    // 4. Combine all conditions into the WHERE clause
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // --- New Sorting Logic ---
    
    // 5. Add ORDER BY clause (if sort parameter is valid)
    if (sortBy) {
        // Define a list of allowed sortable columns to prevent SQL injection
        const allowedSorts = ['name', 'price', 'id']; 
        
        // Check if the requested sort column is safe
        if (allowedSorts.includes(sortBy.toLowerCase())) {
            // Append the ORDER BY clause dynamically
            // Note: We use the column name directly here because we verified it against the allowedSorts list.
            sqlquery += ` ORDER BY ${sortBy.toLowerCase()} ASC`; 
            // You could optionally add logic here to check for 'desc' parameter (e.g., &order=desc)
        } else {
            console.warn(`Invalid sort parameter ignored: ${sortBy}`);
        }
    }
    
    console.log(`Executing SQL: ${sqlquery} with params: ${queryParams}`);
    
    // 6. Execute the SQL query
    db.query(sqlquery, queryParams, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            res.status(500).json({ error: "Failed to retrieve books from the database." });
            next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router
