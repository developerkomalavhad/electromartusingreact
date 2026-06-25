// Validation middleware for request data

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Name, email, and password are required",
    });
  }

  // Validate name
  if (name.trim().length < 2) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Name must be at least 2 characters",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid email format",
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Password must be at least 6 characters",
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Email and password are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid email format",
    });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, category, price, description, image } = req.body;

  if (!name || !category || !price || !description || !image) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Name, category, price, description, and image are required",
    });
  }

  if (name.trim().length < 3) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Product name must be at least 3 characters",
    });
  }

  const validCategories = ["Laptop", "Mobile", "Accessory"];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: "Validation Error",
      message: `Category must be one of: ${validCategories.join(", ")}`,
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Price must be a positive number",
    });
  }

  if (description.trim().length < 10) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Description must be at least 10 characters",
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { items, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Order must contain at least one item",
    });
  }

  if (typeof total !== "number" || total <= 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Total must be a positive number",
    });
  }

  // Validate each item
  for (let item of items) {
    if (!item.name || !item.price || !item.quantity) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Each item must have name, price, and quantity",
      });
    }

    if (item.price <= 0 || item.quantity <= 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Item price and quantity must be positive",
      });
    }
  }

  next();
};

const validateOrderStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Status is required",
    });
  }

  const validStatuses = ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Validation Error",
      message: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  next();
};

const validateUserStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Status is required",
    });
  }

  const validStatuses = ["Active", "Blocked"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Validation Error",
      message: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateOrderStatus,
  validateUserStatus,
};