// Define the custom error class
class CustomError extends Error {
  constructor(message,shortMessage,originalError = null) {
    super(message);
    this.shortMessage = shortMessage;
    this.name = 'CustomError';
    if (originalError) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}

// Export the custom error class
module.exports = CustomError;
