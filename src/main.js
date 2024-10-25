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
                    position: relative;
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

                .userIcon-image {
                    width: .5in;
                    height: .5in;
                    margin:  auto;
                }

                .passKeyIcon-image {
                    width: .63in;
                    height: .35in;
                    margin: auto;
                }

                .instructions {
                    margin-top: 4in;
                    align-text: center;
                    position: absolute;
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
                <div class="name">${displayName}</div>
                <img src="${frontQR}" class="qr-image" alt="Front QR Code">
                <img src="/userIcon.png" class="userIcon-image" alt="User Icon">
                
            </div>
            
            <div class="card">
                <div class="name">${displayName}</div>
                <img src="${backQR}" class="qr-image" alt="Back QR Code">
                <img src="/passKeyIcon.png" class="passKeyIcon-image" alt="Key Icon">
            </div>
            <p class="instructions">
            <b>Instructions:</b>
            <br>
            1.) Cut the the badges out along the dashed lines.
            <br>
            2.) Place badges back to back with QR code facing out in a badge holder.
            <br>
            3.) Please do not let any unauthorized access to your badge. Do not share it with anyone.
            <br>
            4.) You will need to update the password QR quarterly once your current password expires.
            </p>
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
