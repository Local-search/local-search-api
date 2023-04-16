const { JWT_SEC } = require("../config/secrets");
const { REFRESH_SEC } = require("../config/secrets");
const userModel = require("../models/user.model");
const ERROR = require("../utils/Error");

const RefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return next(ERROR(401, "cookies not avalible "))
    const refreshToken = cookies.jwt
    try {
        const userFound = await userModel.findOne({ refreshToken });
        if (!userFound) return next(ERROR(403, "token expired"));
        if (userFound) {

            jwt.verify(refreshToken, REFRESH_SEC, (err, decoded) => {
                if (err || userFound.username !== decoded.username)
                    return next(ERROR(403, "invalid Token"))
                const accessToken = jwt.sign(
                    {
                        id: decoded._id,
                        fullName: decoded.fullName,
                        role: decoded.role,
                        email: decoded.email
                    }, JWT_SEC,
                    { expiresIn: "1m" },
                )
                res.status(201).json(accessToken)
            })
        }
    } catch (err) {

    }

}