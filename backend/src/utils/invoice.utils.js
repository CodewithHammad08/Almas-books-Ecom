import PDFDocument from 'pdfkit';

/**
 * Generates a premium, professional PDF invoice for an order
 * @param {Object} order - The order document
 * @param {Object} user - The user document
 * @returns {Promise<Buffer>} - PDF Buffer
 */
export const generateInvoicePDF = async (order, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                margin: 0, // We'll handle margins manually for the header
                size: 'A4' 
            });
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));

            // --- THEME COLORS ---
            const primaryColor = "#F59E0B"; // Amber 500
            const secondaryColor = "#111111"; // Deep Black
            const lightGray = "#F9FAFB"; 
            const borderColor = "#E5E7EB";
            const textGray = "#4B5563";

            // --- HEADER ---
            doc.rect(0, 0, 595.28, 120).fill(secondaryColor);
            
            doc.fillColor(primaryColor)
               .fontSize(28)
               .font('Helvetica-Bold')
               .text("ALMAS BOOKS", 50, 45);
            
            doc.fillColor("#FFFFFF")
               .fontSize(10)
               .font('Helvetica')
               .text("Premium Stationery & Books", 50, 75);

            doc.fillColor("#FFFFFF")
               .fontSize(22)
               .font('Helvetica-Bold')
               .text("INVOICE", 400, 45, { align: "right", width: 145 });

            doc.fillColor(primaryColor)
               .fontSize(10)
               .font('Helvetica-Bold')
               .text(`#${order.orderNumber || order._id.toString().slice(-8).toUpperCase()}`, 400, 75, { align: "right", width: 145 });

            // --- BODY CONTENT START ---
            const margin = 50;
            const bodyTop = 150;

            // Billing Information Section
            doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold').text("BILL TO", margin, bodyTop);
            doc.fillColor(textGray).font('Helvetica').fontSize(11).text(order.shippingAddress.name, margin, bodyTop + 20);
            doc.fontSize(10).text(order.shippingAddress.phone, margin, bodyTop + 35);
            doc.text(order.shippingAddress.street, margin, bodyTop + 50, { width: 200 });
            doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.pincode}`, margin, bodyTop + 65);

            // Invoice Summary Section
            doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold').text("ORDER DETAILS", 350, bodyTop);
            
            const detailsLeft = 350;
            const detailsValueLeft = 450;
            let currentY = bodyTop + 20;

            const addDetail = (label, value, isStatus = false) => {
                doc.fillColor(textGray).font('Helvetica-Bold').fontSize(9).text(label, detailsLeft, currentY);
                if (isStatus) {
                    doc.fillColor(primaryColor).text(value.toUpperCase(), detailsValueLeft, currentY);
                } else {
                    doc.fillColor(secondaryColor).font('Helvetica').text(value, detailsValueLeft, currentY);
                }
                currentY += 15;
            };

            addDetail("Date:", new Date(order.createdAt).toLocaleDateString('en-PK', { year:'numeric', month:'short', day:'numeric' }));
            addDetail("Payment:", order.paymentMethod === 'QR' ? "UPI / QR Code" : order.paymentMethod === 'COD' ? "Cash on Delivery" : "Card");
            addDetail("Status:", order.paymentStatus === 'paid' ? "PAID" : "PENDING", true);

            // --- ITEMS TABLE ---
            const tableTop = 260;
            
            // Table Header Bar
            doc.rect(margin, tableTop, 595.28 - (margin * 2), 25).fill(lightGray);
            doc.fillColor(secondaryColor).font('Helvetica-Bold').fontSize(9);
            doc.text("ITEM DESCRIPTION", margin + 10, tableTop + 8);
            doc.text("QTY", 360, tableTop + 8, { width: 40, align: "center" });
            doc.text("PRICE", 410, tableTop + 8, { width: 60, align: "right" });
            doc.text("TOTAL", 480, tableTop + 8, { width: 60, align: "right" });

            // Table Rows
            let rowY = tableTop + 35;
            doc.font('Helvetica').fontSize(10).fillColor(textGray);

            order.items.forEach((item, index) => {
                // Check for page break if items are many
                if (rowY > 700) {
                    doc.addPage();
                    rowY = 50;
                }

                doc.text(item.productName, margin + 10, rowY, { width: 300 });
                doc.text(item.quantity.toString(), 360, rowY, { width: 40, align: "center" });
                doc.text(`₹${item.price.toLocaleString()}`, 410, rowY, { width: 60, align: "right" });
                doc.text(`₹${(item.quantity * item.price).toLocaleString()}`, 480, rowY, { width: 60, align: "right" });
                
                // Zebra striping line
                doc.moveTo(margin, rowY + 15).lineTo(545, rowY + 15).strokeColor(borderColor).lineWidth(0.5).stroke();
                rowY += 25;
            });

            // --- TOTALS ---
            const totalsTop = rowY + 10;
            doc.font('Helvetica').fontSize(10).fillColor(textGray);
            
            doc.text("Subtotal:", 380, totalsTop, { width: 80, align: "right" });
            doc.fillColor(secondaryColor).text(`₹${(order.totalPrice - 50).toLocaleString()}`, 470, totalsTop, { width: 75, align: "right" });
            
            doc.fillColor(textGray).text("Shipping:", 380, totalsTop + 20, { width: 80, align: "right" });
            doc.fillColor(secondaryColor).text("₹50", 470, totalsTop + 20, { width: 75, align: "right" });

            doc.rect(380, totalsTop + 40, 165, 35).fill(lightGray);
            doc.fillColor(secondaryColor).font('Helvetica-Bold').fontSize(12).text("GRAND TOTAL", 390, totalsTop + 52);
            doc.fillColor(primaryColor).fontSize(14).text(`₹${order.totalPrice.toLocaleString()}`, 470, totalsTop + 50, { width: 65, align: "right" });

            // --- FOOTER ---
            const footerY = 750;
            doc.rect(0, footerY, 595.28, 50).fill(secondaryColor);
            
            doc.fillColor("#FFFFFF")
               .fontSize(9)
               .font('Helvetica')
               .text("Thank you for your business! This is a system generated invoice for Almas Books & General Store.", 0, footerY + 15, { align: "center", width: 595 });
            
            doc.fillColor(primaryColor)
               .fontSize(8)
               .font('Helvetica-Bold')
               .text("support@almasbooks.com | www.almasbooks.com", 0, footerY + 30, { align: "center", width: 595 });

            // Stamp / Watermark (PAID Badge)
            if (order.paymentStatus === 'paid') {
                doc.save();
                doc.rotate(-20, { origin: [300, 400] });
                doc.opacity(0.1);
                doc.fillColor(primaryColor).fontSize(100).font('Helvetica-Bold').text("PAID", 150, 350, { align: 'center', width: 300 });
                doc.restore();
            }

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};
