// /**
//  * Forgot password
//  */
// exports.forgotPassword = catchAsync(async (req, res, next) => {
//     // Get user by email
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//         return next(new AppError('There is no user with that email address', 404));
//     }

//     // Generate random reset token
//     const resetToken = user.createPasswordResetToken();

//     console.log("Hashed Token________________________________:", resetToken);
//     await user.save({ validateBeforeSave: false });

//     // Create password reset URL
//     const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     try {
//         // Send password reset email
//         await emailService.sendPasswordResetEmail(user, resetToken, resetURL);

//         res.status(200).json({
//             status: 'success',
//             message: 'Token sent to email'
//         });
//     } catch (err) {
//         // If email sending fails, clear the reset token
//         user.passwordResetToken = undefined;
//         user.passwordResetExpires = undefined;
//         await user.save({ validateBeforeSave: false });

//         return next(new AppError('There was an error sending the email. Try again later!', 500));
//     }
// });