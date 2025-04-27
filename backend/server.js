const express = require('express');
const cors = require('cors');





const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
