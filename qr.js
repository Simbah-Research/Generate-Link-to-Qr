const { jsPDF } = window.jspdf;
const form = document.getElementById("qr-form");
const qrcodeDiv = document.getElementById("qrcode");
const loader = document.querySelector(".loader");
const modal = document.getElementById("successModal");
const closeBtn = document.querySelector(".close");
const downloadBtn = document.getElementById("downloadPdf");
const closeModalBtn = document.getElementById("closeModal");
let qrCodeInstance;

// Service dropdown functionality
const serviceBtn = document.querySelector(".service-btn");
const dropdownContent = document.querySelector(".dropdown-content");

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.matches(".service-btn")) {
    serviceBtn.classList.remove("active");
  }
});

// Navbar scroll behavior
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
  } else {
    navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
  }
});

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const link = document.getElementById("link").value;

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

  // Add (SR) text to the center of QR code
  const qrImage = qrcodeDiv.querySelector("img");
  const srText = document.createElement("div");
  srText.textContent = "SR";
  srText.style.position = "absolute";
  srText.style.top = "50%";
  srText.style.left = "50%";
  srText.style.transform = "translate(-50%, -50%)";
  srText.style.fontSize = "34px";
  srText.style.fontWeight = "bold";
  srText.style.color = "black";
  srText.style.backgroundColor = "white";
  srText.style.padding = "10px"; // Menambahkan padding untuk membuat teks lebih besar
  srText.style.borderRadius = "50%"; // Membuat latar belakang teks menjadi bulat
  srText.style.width = "50px"; // Mengatur lebar teks agar latar belakang juga bulat
  srText.style.height = "50px"; // Mengatur tinggi teks agar latar belakang juga bulat
  srText.style.display = "flex"; // Mengaktifkan tampilan flex
  srText.style.justifyContent = "center"; // Mengatur posisi teks secara horizontal
  srText.style.alignItems = "center"; // Mengatur posisi teks secara vertikal
  qrcodeDiv.style.position = "relative";
  qrcodeDiv.appendChild(srText);
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
});

// Modal handling
closeBtn.onclick = closeModalBtn.onclick = () => {
  modal.style.display = "none";
  form.reset();
  qrcodeDiv.innerHTML = "";
  downloadBtn.style.display = "none";
  closeModalBtn.style.display = "none";
};

// PDF generation
downloadBtn.onclick = () => {
  const pdf = new jsPDF();
  const title = document.getElementById("title").value;
  const link = document.getElementById("link").value;

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

  // Add (SR) text to the center of QR code in PDF
  pdf.setFillColor(255, 255, 255);
  pdf.circle(pageWidth / 2, qrCodeY + qrCodeSize / 2, 10, "F");
  pdf.setFontSize(18);
  pdf.setTextColor(0);
  pdf.text("SR", pageWidth / 2, qrCodeY + qrCodeSize / 2, {
    align: "center",
    baseline: "middle",
  });

  // Link styling
  pdf.setFontSize(10);
  pdf.setFont(undefined, "normal");
  const linkWidth = qrCodeSize;
  const linkX = qrCodeX;
  const linkY = qrCodeY + qrCodeSize + 10;

  const linkLines = pdf.splitTextToSize(link, linkWidth);
  const linkHeight = pdf.getTextDimensions(linkLines).h;

  pdf.text(linkLines, pageWidth / 2, linkY, {
    align: "center",
    maxWidth: linkWidth,
  });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  const footerText = "© 2024 SR | All rights reserved.";
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

document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });
});
