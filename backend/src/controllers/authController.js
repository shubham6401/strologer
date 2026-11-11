const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ExecutiveProfile = require('../models/ExecutiveProfile');

// Generate JWT token helper
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'strologer_secret_key_development_jwt_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// Executive Registration
exports.executiveRegister = async (req, res, next) => {
  try {
    const { name, email, phone, password, title, experience, pricePerMinute, specializations } = req.body;

    // Check if email exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Create user with EXECUTIVE role
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password,
      role: 'EXECUTIVE',
    });

    // Create ExecutiveProfile
    const profile = await ExecutiveProfile.create({
      userId: user._id,
      title: title || 'Acharya',
      experience: experience ? Number(experience) : 5,
      pricePerMinute: pricePerMinute ? Number(pricePerMinute) : 20,
      specialization: Array.isArray(specializations)
        ? specializations
        : ['Kundli Analysis', 'Career Guidance', 'Marriage Consultation'],
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Executive account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// Executive Login
exports.executiveLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Enforce Executive Role
    if (user.role !== 'EXECUTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This login is reserved for Astrologer Executives. Please use the Customer Login portal.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const profile = await ExecutiveProfile.findOne({ userId: user._id });
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// Customer (Normal User) Registration
exports.userRegister = async (req, res, next) => {
  try {
    const { name, email, phone, password, dateOfBirth, timeOfBirth, placeOfBirth, gender } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password,
      role: 'NORMAL_USER',
      birthDetails: {
        dateOfBirth: dateOfBirth || '',
        timeOfBirth: timeOfBirth || '',
        placeOfBirth: placeOfBirth || '',
        gender: gender || '',
      },
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to our astrology portal.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        birthDetails: user.birthDetails,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Customer (Normal User) Login
exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Role check: Normal User
    if (user.role !== 'NORMAL_USER') {
      return res.status(403).json({
        success: false,
        message: 'You have an Executive Astrologer account. Please log in through the Executive Astrologer Portal.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        birthDetails: user.birthDetails,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current authenticated user details
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'EXECUTIVE') {
      profile = await ExecutiveProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        birthDetails: user.birthDetails,
        profileImage: user.profileImage,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, birthDetails, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (birthDetails && user.role === 'NORMAL_USER') {
      user.birthDetails = {
        ...user.birthDetails,
        ...birthDetails,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        birthDetails: user.birthDetails,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password Request
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't disclose account existence for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, password reset instructions have been generated.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully. In development, use this reset token.',
      devResetToken: resetToken, // Provided for easy development testing
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password with Token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You may now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
