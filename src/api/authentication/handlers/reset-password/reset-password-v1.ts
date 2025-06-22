// /**
//  * Reset password
//  */
// exports.resetPassword = catchAsync(async (req, res, next) => {
//     // Decode and sanitize token (if necessary)
//     const decodedToken = req.params.token.trim(); // trim spaces

//     // Find user by token and expiration
//     const user = await User.findOne({
//         passwordResetToken: decodedToken,
//         passwordResetExpires: { $gt: Date.now() }, // Ensure token hasn't expired
//     });

//     // Debugging: Print token and expiration values
//     console.log('Request Token:', decodedToken);
//     console.log('Database Token:', user ? user.passwordResetToken : 'No user found');
//     console.log('Password Reset Expires:', user ? user.passwordResetExpires : 'No user found');

//     // If user is not found or token is expired
//     if (!user) {
//         return next(new AppError('Token is invalid or has expired', 400));
//     }

//     // Proceed with resetting the password
//     user.password = await bcrypt.hash(req.body.password, 12);
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     user.passwordChangedAt = Date.now() - 1000; // Ensure token is created after password change
//     await user.save();

//     // Send token and log in the user
//     createSendToken(user, 200, req, res);
// });