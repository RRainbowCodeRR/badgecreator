import QRCode from "qrcode";

// Get DOM elements
const frontCanvas = document.getElementById("frontCanvas");
const backCanvas = document.getElementById("backCanvas");
const nameInput = document.getElementById("nameInput");
const userIDInput = document.getElementById("userIDInput");
const passwordInput = document.getElementById("passwordInput");

async function generateQRCode(text, canvas) {
  try {
    await QRCode.toCanvas(canvas, text, {
      width: 128,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

async function updateQRCodes() {
  const userId = userIDInput.value;
  const password = passwordInput.value;

  if (!userId || !password) {
    alert("Please fill in both User ID and Password fields");
    return;
  }

  try {
    // Generate QR codes
    await generateQRCode(userId, frontCanvas);
    await generateQRCode(password, backCanvas);

    // Update display name
    const displayName = document.getElementById("displayName");
    if (displayName && nameInput.value) {
      displayName.textContent = nameInput.value;
    }
  } catch (error) {
    console.error("Error updating QR codes:", error);
    alert("Error generating QR codes. Please try again.");
  }
}

// Add event listener to generate button
document
  .getElementById("generateButton")
  ?.addEventListener("click", updateQRCodes);

// Function to create printable version
function createPrintableVersion() {
  // Create a new window for printing
  const printWindow = window.open("", "_blank");

  // Get the generated QR codes
  const frontQR = document.getElementById("frontCanvas").toDataURL();
  const backQR = document.getElementById("backCanvas").toDataURL();
  const displayName = document.getElementById("displayName").textContent;

  // Create the print HTML content
  const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print QR Badges</title>
            <style>
                @page {
                    size: letter;
                    margin: 0.5in;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    gap: 0.5in;
                    padding-top: 1in;
                }
                
                .card {
                    border: 1px dashed black;
                    background-color: white;
                    border-radius: 10px;
                    width: 2.1in;
                    height: 3.4in;
                    text-align: center;
                    padding: 10px;
                    box-sizing: border-box;
                }
                
                .qr-image {
                    width: 1.5in;
                    height: 1.5in;
                    margin: 0.2in auto;
                }
                
                .name {
                    font-family: Arial, sans-serif;
                    font-size: 14pt;
                    margin-top: 0.1in;
                }

                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="card">
                <img src="${frontQR}" class="qr-image" alt="Front QR Code">
                <div class="name">${displayName}</div>
            </div>
            
            <div class="card">
                <img src="${backQR}" class="qr-image" alt="Back QR Code">
            </div>
        </body>
        </html>
    `;

  // Write content to the new window
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait for images to load before printing
  printWindow.onload = function () {
    printWindow.print();
    // Uncomment the next line if you want the print window to close after printing
    // printWindow.close();
  };
}

// Add print button to your HTML
document.addEventListener("DOMContentLoaded", () => {
  const buttonContainer = document.querySelector(".input-group");
  const printButton = document.createElement("button");
  printButton.textContent = "Print Badges";
  printButton.style.marginLeft = "10px";
  printButton.addEventListener("click", createPrintableVersion);
  buttonContainer.appendChild(printButton);
});
