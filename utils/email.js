import nodemailer from "nodemailer";

export const sendOrderConfirmation = async (userEmail, orderDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsList = orderDetails.items
      .map(
        (item) =>
          `- ${item.name} (Size: ${item.size}, Qty: ${item.quantity}) - $${item.price}`
      )
      .join("\n");

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Order Confirmation - Order #${orderDetails.orderId}`,
      text: `
Thank you for your order!

Order Summary:
--------------
Order ID: ${orderDetails.orderId}
Order Date: ${new Date(orderDetails.orderDate).toLocaleDateString()}

Items Purchased:
${itemsList}

Total Price: $${orderDetails.totalPrice.toFixed(2)}

We'll send you another email when your order ships.

Thank you for shopping with us!
      `,
      html: `
        <h2>Thank you for your order!</h2>
        <h3>Order Summary</h3>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Order Date:</strong> ${new Date(
          orderDetails.orderDate
        ).toLocaleDateString()}</p>
        <h3>Items Purchased:</h3>
        <ul>
          ${orderDetails.items
            .map(
              (item) =>
                `<li>${item.name} (Size: ${item.size}, Quantity: ${item.quantity}) - $${item.price}</li>`
            )
            .join("")}
        </ul>
        <h3><strong>Total Price: $${orderDetails.totalPrice.toFixed(
          2
        )}</strong></h3>
        <p>We'll send you another email when your order ships.</p>
        <p>Thank you for shopping with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};
