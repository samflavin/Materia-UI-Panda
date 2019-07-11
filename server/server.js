const express = require('express');
const bodyParser = require('body-parser');

const inventoryRouter = require('./routes/inventory.router.js');

const app = express();
/** ---------- MIDDLEWARE ---------- **/
// needed for axios requests
app.use(bodyParser.json()); 
app.use(express.static('build'));

/** ---------- EXPRESS ROUTES ---------- **/
app.use('/inventory', inventoryRouter);

/** ---------- START SERVER ---------- **/
const PORT = process.env.PORT || 5000;
app.listen(PORT,  () => {
    console.log(`Server listening on port ${PORT}...`);
});