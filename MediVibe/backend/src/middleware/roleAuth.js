const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in first.'
      });
    }

    const userRole = req.user.role;
    
    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: `Access denied. No role assigned to your account. Contact administrator. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role "${userRole}" is not authorized for this action. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

export default roleAuth;
