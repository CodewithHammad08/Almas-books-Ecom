import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    // 1) Create a transporter
    // For production, use a real service like Resend, SendGrid, or Gmail SMTP
    // For development, you can use Mailtrap or just log to console
    
    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

    if (!hasSmtp) {
        console.log("--- SIMULATED EMAIL ---");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body: ${options.message}`);
        console.log("------------------------");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: `Almas Books <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmation = async (user, order) => {
    const subject = `Order Confirmed - #${order._id.slice(-8).toUpperCase()}`;
    const itemsList = order.items.map(item => `- ${item.productName} (x${item.quantity}): ₹${item.price}`).join("\n");
    
    const message = `Hello ${user.name},\n\nThank you for shopping with Almas Books! Your order has been placed successfully.\n\nOrder ID: #${order._id}\nTotal: ₹${order.totalPrice}\n\nItems:\n${itemsList}\n\nShipping to:\n${order.shippingAddress.street}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}\n\nWe will notify you when your order is shipped.\n\nBest regards,\nThe Almas Books Team`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #f59e0b;">Order Confirmed!</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>Thank you for shopping with <strong>Almas Books</strong>! Your order has been placed successfully.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Order ID:</strong> #${order._id}</p>
                <p><strong>Total:</strong> ₹${order.totalPrice.toLocaleString()}</p>
            </div>
            <h3>Items:</h3>
            <ul>
                ${order.items.map(item => `<li>${item.productName} (x${item.quantity}) - ₹${item.price.toLocaleString()}</li>`).join("")}
            </ul>
            <p><strong>Shipping to:</strong><br/>${order.shippingAddress.street}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #888; font-size: 12px; text-align: center;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
    `;

    await sendEmail({
        email: user.email,
        subject,
        message,
        html
    });
};
