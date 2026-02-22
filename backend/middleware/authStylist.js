import jwt from 'jsonwebtoken'

/**
 * Stylist Authentication Middleware
 * Verifies stylist token from request headers
 * Adds stylist ID to request body for use in controllers
 */
const authStylist = async (req, res, next) => {
  // Extract stylist token from headers
  const { stoken } = req.headers

  // Check if token exists
  if (!stoken) {
    return res.json({
      success: false,
      message: 'Not Authorized. Login Again',
    })
  }

  try {
    // Verify token using JWT secret
    const token_decode = jwt.verify(stoken, process.env.JWT_SECRET)

    // Add stylist ID to request body for downstream use
    req.body.stylistId = token_decode.id

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

export default authStylist
