const { jsPDF } = window.jspdf;
const form = document.getElementById("qr-form");
const qrcodeDiv = document.getElementById("qrcode");
const loader = document.querySelector(".loader");
const modal = document.getElementById("successModal");
const closeBtn = document.querySelector(".close");
const downloadBtn = document.getElementById("downloadPdf");
const closeModalBtn = document.getElementById("closeModal");
let qrCodeInstance;

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.matches(".service-btn")) {
    const serviceBtn = document.querySelector(".service-btn");
    if (serviceBtn) serviceBtn.classList.remove("active");
  }
});

// Navbar scroll behavior
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
  }
});

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const link = document.getElementById("link").value;
  const initials = document
    .getElementById("initials")
    .value.trim()
    .toUpperCase();

  loader.style.display = "block";
  qrcodeDiv.innerHTML = "";
  downloadBtn.style.display = "none";
  closeModalBtn.style.display = "none";

  await new Promise((resolve) => setTimeout(resolve, 2000));

  qrCodeInstance = new QRCode(qrcodeDiv, {
    text: link,
    width: 256,
    height: 256,
  });

  // Add initials or SR text to the center of QR code
  const qrImage = qrcodeDiv.querySelector("img");
  const centerText = document.createElement("div");
  centerText.textContent = initials || "SR";
  centerText.style.position = "absolute";
  centerText.style.top = "50%";
  centerText.style.left = "50%";
  centerText.style.transform = "translate(-50%, -50%)";

  // Dynamic font sizing based on initials length
  centerText.style.fontSize = initials.length > 2 ? "20px" : "34px";
  centerText.style.fontWeight = "bold";
  centerText.style.color = "black";
  centerText.style.backgroundColor = "white";
  centerText.style.padding = "10px";
  centerText.style.borderRadius = "50%";
  centerText.style.width = "50px";
  centerText.style.height = "50px";
  centerText.style.display = "flex";
  centerText.style.justifyContent = "center";
  centerText.style.alignItems = "center";
  qrcodeDiv.style.position = "relative";
  qrcodeDiv.appendChild(centerText);

  // Center the QR code
  qrcodeDiv.style.display = "flex";
  qrcodeDiv.style.justifyContent = "center";
  qrcodeDiv.style.alignItems = "center";
  qrcodeDiv.style.margin = "20px 0";

  loader.style.display = "none";
  modal.style.display = "block";
  downloadBtn.style.display = "block";
  closeModalBtn.style.display = "block";

  console.log("Title:", title);
  console.log("Link:", link);
  console.log("Initials:", initials || "SR");
});

// Modal handling
function closeModal() {
  modal.style.display = "none";
  form.reset();
  qrcodeDiv.innerHTML = "";
  downloadBtn.style.display = "none";
  closeModalBtn.style.display = "none";
}

closeBtn.onclick = closeModal;
closeModalBtn.onclick = closeModal;

// PDF generation
downloadBtn.onclick = () => {
  const pdf = new jsPDF();
  const title = document.getElementById("title").value;
  const link = document.getElementById("link").value;
  const initials = document
    .getElementById("initials")
    .value.trim()
    .toUpperCase();

  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;

  // Title styling
  pdf.setFontSize(24);
  pdf.setFont(undefined, "bold");
  pdf.text(title, pageWidth / 2, 30, { align: "center" });

  // QR Code
  const qrCodeDataUrl = qrcodeDiv.querySelector("img").src;
  const qrCodeSize = 120;
  const qrCodeX = (pageWidth - qrCodeSize) / 2;
  const qrCodeY = 60;
  pdf.addImage(qrCodeDataUrl, "PNG", qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

  // Add text to the center of QR code in PDF
  pdf.setFillColor(255, 255, 255);
  pdf.circle(pageWidth / 2, qrCodeY + qrCodeSize / 2, 10, "F");

  // Dynamic font sizing for PDF
  pdf.setFontSize(initials.length > 2 ? 14 : 18);
  pdf.setTextColor(0);
  pdf.text(initials || "SR", pageWidth / 2, qrCodeY + qrCodeSize / 2, {
    align: "center",
    baseline: "middle",
  });

  // Link styling
  pdf.setFontSize(10);
  pdf.setFont(undefined, "normal");
  const linkWidth = qrCodeSize;
  const linkY = qrCodeY + qrCodeSize + 10;

  const linkLines = pdf.splitTextToSize(link, linkWidth);
  pdf.text(linkLines, pageWidth / 2, linkY, {
    align: "center",
    maxWidth: linkWidth,
  });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  const footerText = "© 2024 | Si'Mbah_Research";
  pdf.text(footerText, pageWidth / 2, pageHeight - 10, {
    align: "center",
  });

  pdf.save(`${title}_QRIS.pdf`);
};

// Close modal when clicking outside
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    downloadBtn.style.display = "none";
    closeModalBtn.style.display = "none";
  }
};

// Mobile navigation toggle
document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }
});
