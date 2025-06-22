const items = [];
let itemId = 1;
const nodemailer = require("nodemailer");

exports.addItem = (req, res) => {
  const { itemName, itemType, itemDescription } = req.body;
  const coverImage = req.files.coverImage?.[0]?.filename;
  const additionalImages = req.files.additionalImages?.map(img => img.filename) || [];

  const newItem = {
    id: itemId++,
    itemName,
    itemType,
    itemDescription,
    coverImage,
    additionalImages
  };

  items.push(newItem);
  res.status(201).json({ message: "Item successfully added", item: newItem });
};

exports.getItems = (req, res) => {
  res.json(items);
};

exports.enquireItem = async (req, res) => {
  const nodemailer = require("nodemailer");
  
  // Assuming items is defined elsewhere - you'll need to import/define it
  // const items = require('./path-to-items'); // Add this line
  
  const item = items.find(i => i.id == req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  try {
    // 1. Create a test account from Ethereal with timeout
    console.log("Creating test account...");
    const testAccount = await Promise.race([
      nodemailer.createTestAccount(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout creating test account')), 10000)
      )
    ]);
    
    console.log("Test account created:", testAccount.user);

    // 2. Create a transporter using the test account
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 10000,     // 10 seconds
    });

    // 3. Define the email content
    const mailOptions = {
      from: '"Item Enquiry Bot" <no-reply@example.com>',
      to: testAccount.user, // Use the test account email
      subject: `Enquiry for Item: ${item.itemName}`,
      text: `Someone enquired about the item: ${item.itemName} (${item.itemType})\n\nDescription: ${item.itemDescription}`,
    };

    // 4. Send the email with timeout
    console.log("Sending enquiry email...");
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout sending email')), 15000)
      )
    ]);
    
    console.log("Email sent!", info.messageId);

    // 5. Respond with preview URL
    res.json({
      message: "Enquiry email sent (Ethereal)",
      preview: nodemailer.getTestMessageUrl(info),
      messageId: info.messageId
    });

  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ 
      error: "Failed to send email", 
      details: err.message 
    });
  }
};
