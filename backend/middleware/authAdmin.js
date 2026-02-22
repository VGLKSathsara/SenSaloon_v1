import jwt from 'jsonwebtoken'

/**
 * Admin Authentication Middleware
 * Verifies admin token from request headers
 * Ensures only authenticated admins can access protected routes
 */
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers

    // Check if token exists
    if (!atoken) {
      return res.json({
        success: false,
        message: 'Not Authorized Login Again',
      })
    }

    // Verify token
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

    // Check if token belongs to admin (matches admin credentials)
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: 'Not Authorized Login Again',
      })
    }

    // Token is valid, proceed to next middleware/controller
    next()
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message,
    })
  }
}

export default authAdmin
