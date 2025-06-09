import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';

// Generate id
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36); // base36 timestamp
  const random = Math.random().toString(36).substring(2, 7); // random string
  return `ORD-${timestamp}-${random}`.toUpperCase(); // example: ORD-LS0H3X-5G7QK
};


// Place order
const placeOrder = async (req, res) => {
  try {
    const { cart, shippingInfo } = req.body;
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }
    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (!shippingInfo) {
      return res.status(400).json({ success: false, message: "Shipping info missing" });
    }

    const address = {
      fullName: shippingInfo.fullName,
      phone: shippingInfo.phone,
      street: shippingInfo.address1 + (shippingInfo.address2 ? ", " + shippingInfo.address2 : ""),
      city: shippingInfo.state, 
      country: "Palestine",
    };

    const amount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber =  generateOrderNumber();

    const orderData = {
      userId: userId,
      referenceId: orderNumber, 
      items: cart.map(({ productId, name, price, quantity, color }) => ({
        productId,
        name,
        price,
        quantity,
        color
      })),
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };


    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Remove only ordered items from cartData
    const existingUser = await userModel.findById(userId);
    if (existingUser && existingUser.cartData) {
      const updatedCart = { ...existingUser.cartData };
      cart.forEach((item) => {
        delete updatedCart[item.productId];
      });
      await userModel.findByIdAndUpdate(userId, { cartData: updatedCart });
    }

    res.json({ success: true, message: "Order Placed", referenceId: orderNumber });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to get all orders (Admin Panel)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });

    const formattedOrders = orders.map(order => {
      const orderObj = order.toObject();
      return {
        ...orderObj,
        referenceId: order.referenceId,
      };
    });

    res.json({ success: true, data: formattedOrders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to get orders by user (Frontend)
const userOrders = async (req, res) => {
  try {

    // 1. Fetch all orders for the userAdd commentMore actions
    const ordersDocs = await orderModel.find({ userId: req.user.id });
    const orders = ordersDocs.map(order => order.toObject());

    // 2. Extract unique productIds from all order items
    const productIds = [
      ...new Set(
        orders.flatMap(order =>
          order.items.map(item => item.productId).filter(id => id)
        )
      )
    ];

    // 3. Fetch matching productsAdd commentMore actions
    const productDocs = await productModel.find({ _id: { $in: productIds } });
    const products = productDocs.map(product => product.toObject());

    // 4. Create a Map of productId -> product (with cloudinary URLs for images)Add commentMore actions
    const productMap = new Map();

    products.forEach(product => {
      productMap.set(product.id, product);
    });


    const ordersWithImages = orders.map(order => {
      order.items = order.items.map(item => {
        const product = productMap.get(item.productId);

        item.productDetails = {
          images: product?.images || []
        };

        return item;
      });
      return order;
    });

    res.json({ success: true, data: ordersWithImages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Company order
const getCompanyOrders = async (req, res) => {
  try {
    const companyProducts = await productModel.find({ companyId: req.user.companyId });
    const companyProductIds = companyProducts.map(p => p._id.toString());

    const orders = await orderModel.find({
      "items.productId": { $in: companyProductIds },
    }).sort({ date: -1 });

    const productMap = {};
    companyProducts.forEach(p => {
      productMap[p._id.toString()] = p.name;
    });

    const userIds = [...new Set(orders.map(o => o.userId.toString()))];
    const users = await userModel.find({ _id: { $in: userIds } }, { username: 1 });
    const userMap = {};
    users.forEach(u => userMap[u._id.toString()] = u.username);

    const filteredOrders = orders.map(order => {
      const filteredItems = order.items
        .filter(item => companyProductIds.includes(item.productId.toString()))
        .map(item => ({
          productId: item.productId,
          name: productMap[item.productId.toString()] || "Unknown",
          quantity: item.quantity,
          color: item.color || "N/A" ,
        }));

      const companyAmount = filteredItems.reduce((sum, item) => {
        const product = companyProducts.find(p => p._id.toString() === item.productId.toString());
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      return {
        id: order.id,
        referenceId: order.referenceId,
        customer: userMap[order.userId.toString()] || "Unknown",
        items: filteredItems,
        amount: companyAmount,
        date: order.date,
        status: order.status,
      };
    });

    res.json({ success: true, data: filteredOrders });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Order - ready
const setOrderReady = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: "Order ID required" });

    const order = await orderModel.findById(orderId);
    // const order = await orderModel.findOne({ orderNumber: orderId }); 
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Ensure the order contains items from the logged-in company
    const companyProducts = await productModel.find({ companyId: req.user.companyId });
    const companyProductIds = companyProducts.map(p => p._id.toString());

    const containsCompanyItems = order.items.some(item =>
      companyProductIds.includes(item.productId.toString())
    );

    if (!containsCompanyItems) {
      return res.status(403).json({ success: false, message: "This order does not include your products" });
    }

    // Toggle status between "Pending" and "Ready"
    const newStatus = order.status === "Ready" ? "Pending" : "Ready";

    await orderModel.findByIdAndUpdate(orderId, { status: newStatus });
    // await orderModel.findOneAndUpdate({ orderNumber: orderId }, { status: newStatus });

    res.json({ success: true, message: `Order marked as ${newStatus}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Function to update the order status (Admin Panel)
// const updateStatus = async (req, res) => {
//     try {
//         const { status } = req.body;
//         const { orderId } = req.params;
//         await orderModel.findByIdAndUpdate(orderId, { status });
//         // await orderModel.findOneAndUpdate({ orderNumber: orderId }, { status });
//         res.json({ success: true, message: 'Status Updated' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const wasAlreadyDelivered = order.status === 'Delivered';

    // If setting to Delivered for the first time, check product stock
    if (status === 'Delivered' && !wasAlreadyDelivered) {
      for (const item of order.items) {
        const product = await productModel.findById(item.productId);
        if (!product) {
          return res.status(404).json({ success: false, message: `Product not found for ID ${item.productId}` });
        }

        if (product.quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for "${product.name}". Available: ${product.quantity}, Needed: ${item.quantity}`
          });
        }
      }

      // All products have enough stock — now update them
      for (const item of order.items) {
        await productModel.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.quantity } }
        );
      }
    }

    // Update order status
    order.status = status;
    await order.save();

    res.json({ success: true, message: 'Status Updated' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export { placeOrder, allOrders, userOrders, updateStatus, getCompanyOrders, setOrderReady };
