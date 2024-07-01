
const jwt = require('jsonwebtoken');
exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.JWT_SECRET)
            req.user = user;
        }
        catch (err) {
        return  res.status(401).json({ error: "token expired" })
        }
        
    } else {
        return res.status(401).json({ error: 'Authorization required' });
    }
    next();
    //jwt.decode()
}


exports.adminMiddleware = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(400).json({ error: 'only admins allowed' })
    }
    next();
}
exports.notReceptionist = (req, res, next) => {
    if(req.user.role === 'receptionist'){
        return res.status(400).json({ error: 'receptionist not allowed' })
    }
    next();
}
// exports.doctorMiddleware = (req, res, next) => {
//     if(req.user.role !== 'doctor'){
//         return res.status(400).json({ error: 'only doctor allowed' })
//     }
//     next();
// }
