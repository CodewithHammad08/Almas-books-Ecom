import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    // Snapshot fields — stored at order time in case product is later edited/deleted
    productName: { type: String, required: true },
    productImage: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        sparse: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: [(arr) => arr.length > 0, "Order must have at least one item"]
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Online", "QR", "Card"],  // ✅ matches controller ALLOWED_PAYMENT_METHODS
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "failed", "refunded"],
        default: "unpaid"  // ✅ aligned with order controller
    },
    transactionId: {
        type: String,
        default: ""
    },
    invoiceUrl: {
        type: String,
        default: ""
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    notes: {
        type: String,
        default: ""
    }
}, { timestamps: true, strict: true }); // ✅ strict: reject undeclared fields (mass assignment protection)

OrderSchema.pre("save", async function () {
    if (!this.orderNumber) {
        // Generate a professional order number: ALM-20240319-XXXX
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const random = Math.floor(1000 + Math.random() * 9000);
        this.orderNumber = `ALM-${date}-${random}`;
    }
});

export const Order = mongoose.model("Order", OrderSchema);
