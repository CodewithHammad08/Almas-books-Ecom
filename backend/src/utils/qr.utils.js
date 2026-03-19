import QRCode from 'qrcode';

/**
 * Generates a UPI URI for the given payment details
 * @param {Object} params - { vpa, name, amount, orderRef, note }
 * @returns {string} - UPI URI
 */
export const generateUPIUri = ({ vpa, name, amount, orderRef, note }) => {
    const encodedName = encodeURIComponent(name);
    const encodedNote = encodeURIComponent(note || `Payment for Order ${orderRef}`);
    
    // Construct UPI Deep Link URI
    return `upi://pay?pa=${vpa}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}&tr=${orderRef}`;
};

/**
 * Generates a QR Code as a Data URL (base64) from a UPI URI
 * @param {string} upiUri - The UPI URI to encode
 * @returns {Promise<string>} - Base64 Data URL of the QR Code
 */
export const generateQRDataURL = async (upiUri) => {
    try {
        const dataUrl = await QRCode.toDataURL(upiUri, {
            margin: 2,
            width: 300,
            color: {
                dark: '#FB7185', // Using a rose-500 tint
                light: '#FFFFFF'
            }
        });
        return dataUrl;
    } catch (err) {
        console.error("QR Generation failed:", err);
        throw new Error("Failed to generate payment QR");
    }
};
