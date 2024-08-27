
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://dhairybagave10072003:nccvjti%40123@ncc24.8lpfl.mongodb.net/?retryWrites=true&w=majority&appName=NCC24', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const entrySchema = new mongoose.Schema({
    firstName: String,
    fatherName: String,
    lastName: String,
    registrationID: { type: String, unique: true },
    branch: String,
    degree: String,
    email: { type: String, unique: true },
    mobile: String,
    bloodGroup: String,
    passingYear: String,
    timestamp: { type: Date, default: Date.now },
});

const Entry = mongoose.model('Entry', entrySchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // For parsing application/json

// Route for form submission
app.post('/submit-form', async (req, res) => {
    try {
        const { registrationID, email } = req.body;

        // Check if registrationID or email already exists
        const existingEntry = await Entry.findOne({ $or: [{ registrationID }, { email }] });
        if (existingEntry) {
            return res.status(400).send('Registration ID or Email already exists.');
        }

        // Save to MongoDB
        const entry = new Entry(req.body);
        await entry.save();

        res.send('You have been registered!');
    } catch (err) {
        console.error('Error while processing form submission:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});





