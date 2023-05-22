document.getElementById('generate-qr-code').addEventListener('click', function(e) {
    e.preventDefault();
    // Get the input text
    var textToEncode = document.getElementById('text-to-encode').value;

    // Clear previous QR code if exists
    document.getElementById("qrcode").innerHTML = "";

    // Create the QR code
    var qrCode = new QRCode(document.getElementById("qrcode"), {
        text: textToEncode,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
});