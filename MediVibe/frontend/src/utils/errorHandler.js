/**
 * Utility to handle API errors consistently across the application
 * Filters out authorization errors that shouldn't be shown to users
 */

/**
 * Check if an error message is an authorization error
 * @param {string} message - Error message from API
 * @returns {boolean} True if it's an authorization/permission error
 */
export const isAuthorizationError = (message = '') => {
  if (!message) return false;
  const authPatterns = [
    'Access denied',
    'not authorized',
    'not allowed',
    'forbidden',
    'permission',
    'role',
    'required roles'
  ];
  return authPatterns.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );
};

/**
 * Get displayable error message, filtering out authorization errors
 * @param {Error} error - Error object from axios
 * @param {string} defaultMsg - Default message if no specific error
 * @returns {string|null} Error message to display, or null if should be hidden
 */
export const getDisplayableErrorMessage = (error, defaultMsg = 'An error occurred') => {
  const message = error?.response?.data?.message || error?.message || defaultMsg;
  
  // Log all errors for debugging
  console.error('API Error:', message);
  
  // Hide authorization errors from UI
  if (isAuthorizationError(message)) {
    console.warn('Authorization error suppressed from UI:', message);
    return null;
  }
  
  return message;
};

/**
 * Safely set error state, filtering authorization errors
 * @param {Error} error - Error object
 * @param {Function} setError - React setState for error
 * @param {string} defaultMsg - Default message
 */
export const handleApiError = (error, setError, defaultMsg = 'An error occurred') => {
  const message = getDisplayableErrorMessage(error, defaultMsg);
  if (message) {
    setError(message);
  }
};

/**
 * Clear authorization error messages and show nothing instead
 * @param {Function} setError - React setState for error
 */
export const clearError = (setError) => {
  setError('');
};
