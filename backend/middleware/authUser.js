import jwt from 'jsonwebtoken'

/**
 * User Authentication Middleware
 * Verifies user token from request headers
 * Adds user ID to request body for use in controllers
 */
const authUser = async (req, res, next) => {
  // Extract user token from headers
  const { token } = req.headers

  // Check if token exists
  if (!token) {
    return res.json({
      success: false,
      message: 'Not Authorized Login Again',
    })
  }

  try {
    // Verify token using JWT secret
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)

    // Add user ID to request body for downstream use
    req.body.userId = token_decode.id

    // Proceed to next middleware/controller
    next()
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message,
    })
  }
}

export default authUser
