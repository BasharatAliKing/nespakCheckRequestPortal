const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors=require("cors");
const port = process.env.PORT || 8000;
const contractorFormRouter = require('./routes/contractorFormRouter');
const clientRouter = require('./routes/clientRouter');
const contractorRouter = require('./routes/contractorRouter');
const consultantRouter = require('./routes/consultantRouter');
const userRouter = require('./routes/userRouter');
const projectRouter = require('./routes/projectRouter');
require('./db/conn');
const allowedOrigins = ["https://k2taj.co.uk", "https://www.k2taj.co.uk", "http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api', contractorFormRouter);
app.use('/api', clientRouter);
app.use('/api', contractorRouter);
app.use('/api', consultantRouter);
app.use('/api', userRouter);
app.use('/api', projectRouter);
app.use('/', (req,res)=>{
    res.send("Hello from the Server Side...");
});

// JSON parse error handler
app.use((err, req, res, next) => {
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({
            message: 'Invalid JSON payload',
            hint: 'Ensure the Body is raw JSON, keys/strings are quoted, no trailing commas.'
        });
    }
    next(err);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});