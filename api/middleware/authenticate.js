
module.exports = (req, res, next) => {
    try {
        console.log("Here user can be authenticated, for now it is passing");
        // throw new Error('Invalid user');
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
            error: error.message
        });
    }
};