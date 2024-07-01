const express = require('express');
const env = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
var fileMorgan = require('file-morgan')
const msg = require('./helpers/lang.json')
const { upload } = require('./middlewares/uploader');

require('./helpers/logger')
require('./services/loadCountries')
const { reminder } = require('./services/appointments_reminder')
env.config();
reminder()
const InitiatorsRoutes = require('./routes/initiator')
const CorporationsRoutes = require('./routes/corporation')
const UsersRoutes = require('./routes/user')
const MediaRoutes = require('./routes/media')
const ContentRoutes = require('./routes/content')
const OrganRoutes = require('./routes/organs')
const AwarnessRoutes = require('./routes/awarness')
const QuestionnaireRoutes = require('./routes/questionnaire')
const CalenderRoutes = require('./routes/calender')
const AppointmentRoutes = require('./routes/appointment')
const CountryRoutes = require('./routes/country');
const VouchersRoutes = require('./routes/vouchers');
//middlewares   
app.use(cors());
app.use(express.json());


app.use(fileMorgan('common', {
    forceProductionMode: true,
    useStreamRotator: true,
    dateFormat: 'DDMMYYYY',
    fileName: 'errors.log',
    directory: 'logs'
}))
app.use(upload.fields([
    { name: "file" },
    { name: "thumbnail" },
    { name: 'pdf' },
    { name: 'introVideo' },
    { name: 'image' },
    { name: 'homeImage' },
    { name: 'video' },
    { name: 'screenImage' },
    { name: 'aboutImage' },
    { name: 'awarnessFile' },
    { name: 'procedureInfo' },
    { name: "freeVoucher" },
    { name: "screeningVoucher" },
    { name: "smokingCessationBrochure" },
    { name: "lungCancerBrochure" }
],

))
// app.use(upload.any())

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/initiators', InitiatorsRoutes)
app.use('/api/corporation', CorporationsRoutes)
app.use('/api/user', UsersRoutes)
app.use('/api/media', MediaRoutes)
app.use('/api/settings', ContentRoutes)
app.use('/api/organs', OrganRoutes)
app.use('/api/awarness', AwarnessRoutes)
app.use('/api/questionnaire', QuestionnaireRoutes)
app.use('/api/calender', CalenderRoutes)
app.use('/api/appointment', AppointmentRoutes)
app.use('/api/country', CountryRoutes)
app.use('/api/vouchers', VouchersRoutes)

//express app port
app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
});
app.use(function (req, res, next) {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
})

//mongodb connection
mongoose.connect('mongodb://localhost:27017/Mubaker', {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected');
});
app.use((err, req, res, next) => {
    const lang = req.headers.lang || 'en'
    console.log('async-express-handler:', `${err.message}`);
    console.log(err)
    return res.status(500).json({ error: msg.errors.serverError[lang], message: err.message });
});
