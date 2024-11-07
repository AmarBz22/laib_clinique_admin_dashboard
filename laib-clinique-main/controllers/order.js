const Notification = require('../models/notification');
const Order = require('../models/order');
const Product = require('../models/product'); // Assuming you have a Product model
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendMail');
require('dotenv').config();


exports.createOrder = async (req, res) => {
  try {
      const { clientName, phone, products, address } = req.body;

      // Calculate the total price of the order
      let total = 0;
      const productDetails = await Promise.all(products.map(async (item) => {
          const product = await Product.findById(item.productId);
          if (!product) {
              throw new Error(`Product with ID ${item.productId} not found`);
          }

          const amount = item.quantity; // Quantity of each product
          
          // Check if quantity exceeds available stock
          if (amount > product.stockQuantity) {
              // Find product recommendations (e.g., similar category products)
              const recommendations = await Product.find({
                  category: product.category, // You can modify the logic here for recommendations
                  _id: { $ne: product._id }, // Exclude the current product
              }).limit(3); // Limit to 3 recommended products

              const recommendationMessage = recommendations.length
                  ? `We recommend these similar products: ${recommendations
                      .map((rec) => `${rec.name} - ${rec.price} USD`)
                      .join(', ')}.`
                  : "Unfortunately, no similar products are available.";

              // Throw an error with the recommendation message
              throw new Error(`Insufficient stock for product ${product.name}. Only ${product.stockQuantity} units are available. ${recommendationMessage}`);
          }

          const priceForProduct = product.price * amount;
          total += priceForProduct;

          return {
              productId: product._id,
              productName: product.name,
              quantity: amount
          };
      }));

      // Create a new order
      const newOrder = new Order({
          clientName,
          phone,
          products: productDetails,
          address,
          total,
          status: 'Pending' // Default status
      });

      // Save the order to the database
      const savedOrder = await newOrder.save();

      // Create a notification
      const notification = new Notification({
          type: 'Order',
          username: clientName, // Store the client's name
          id: savedOrder._id.toString(), // Use the order ID as a string
          seen: false // Default value for seen status
      });

      // Save the notification
      const Newnotification = await notification.save();
      req.io.emit("new-notification", Newnotification);

      // Prepare the email body and subject
      const emailBody = `
      Nouvelle commande du client ${clientName}.<br /><br />
  
      Vous pouvez la consulter en suivant ce lien : <a href="${process.env.Front_URL}/orders/${savedOrder._id}">${process.env.Front_URL}/orders/${savedOrder._id}</a>.<br /><br />
  
      Merci de bien vouloir traiter cette commande dans les plus brefs délais.<br /><br />
  
      Cordialement,<br />
      L'équipe de Laib Clinic
  `;
      const emailSubject = `Nouvelle Commande `; // Dynamic subject line

      // Send email notification to the specified recipient
      await sendEmail(process.env.Mail_sender, emailSubject, emailBody); // Ensure recipient is correct

      // Respond with the created order
      res.status(201).json(savedOrder);
  } catch (error) {
      // If an error occurs, respond with the error message (including recommendations if applicable)
      res.status(500).json({ message: 'Failed to create order', error: error.message });
      console.log(error);
  }
};


exports.confirmOrder = async (req, res) => {
    try {
      const { orderId } = req.params; // Assuming the order ID is passed as a URL parameter
  
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order is already confirmed
      if (order.status === 'Confirmed') {
        return res.status(400).json({ message: 'Order is already confirmed' });
      }
  
      // Update the stock quantity for each product
      await Promise.all(order.products.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
  
        // Ensure sufficient stock is available
        if (product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
  
        // Reduce the product stock by the ordered quantity
        product.stockQuantity -= item.quantity;
        await product.save();
      }));
  
      // Update the order status to "Confirmed"
      order.status = 'Confirmed';
      await order.save();
  
      res.status(200).json({ message: 'Order confirmed successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Failed to confirm order', error: error.message });
    }
  };
  exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find() // Fetch all orders
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .populate('products.productId', 'productName'); // Optionally populate product details
  
      res.status(200).json(orders); // Send the orders as a JSON response
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving orders', error });
    }
  };
  

  exports.getOrderById = async (req, res) => {
    const { id } = req.params;  // or req.body.id, depending on how you're sending it
    
    // Debug the id value
    console.log("Debug: Order ID received: ", id);
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
  
    try {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: `Error fetching order: ${error.message}` });
    }
  };

  exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params; // Extract order ID from URL parameters

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            console.log("Order not found in database."); // Log when order is not found
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order is already cancelled
        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        // Update the order status to "Cancelled"
        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error("Error cancelling order:", error); // Log the error
        res.status(500).json({ message: 'Failed to cancel order', error: error.message });
    }
};

  
  


    exports.deleteOrder = async (req, res) => {
      try {
          const { id } = req.params; // Extract order ID from URL parameters
          
          // Find the order by ID
          const order = await Order.deleteOne({_id:id});
          
          if (order.deletedCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
          }
  
          res.status(200).json({ message: 'Order deleted successfully', order });
      } catch (error) {
          console.error("Error cancelling order:", error); // Log the error
          res.status(500).json({ message: 'Failed to delete order', error: error.message });
      }
};

exports.deleteAllOrders = async () => {
  try {
    const result = await Order.deleteMany({});
    console.log(`Deleted ${result.deletedCount} orders.`);
    return result;
  } catch (error) {
    console.error('Error deleting orders:', error);
    throw error;
  }
};