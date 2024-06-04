let html5QrCode = null;

function lecturaCorrecta(codigoTexto, codigoObjeto) {
  // handle the scanned code as you like, for example:
  console.log(`Code matched = ${codigoTexto}`, codigoObjeto);
  Swal.fire(codigoTexto);
}

function errorLectura(error) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for example:
  //console.warn(`Code scan error = ${error}`);
}


// This method will trigger user permissions
Html5Qrcode.getCameras().then(camaras => {

  if (camaras && camaras.length) {
    let camaraId = camaras[0].id;
    let select = document.getElementById("listaCamaras");
    let html = `<option value="" selected>Seleccione una camara</option>`;

    camaras.forEach(camara => {
      html += `<option value="${camara.id}">${camara.label}</option>`
    });

    select.innerHTML = html;
  }
}).catch(err => {
  // handle err
});

const camaraSeleccionada = (elemento) => {

  let idCamaraSeleccionada = elemento.value;
  console.log('idCamaraSeleccionada :>> ', idCamaraSeleccionada);
  document.getElementById("imagenReferencial").style.display = "none";

    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
      idCamaraSeleccionada, 
      {
        fps: 10,    // Optional, frame per seconds for qr code scanning
        qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
      },lecturaCorrecta,errorLectura)
    .catch((err) => {
      // Start failed, handle it.
    });

}

const detenerCamara = () =>{

  html5QrCode.stop().then((ignore) => {
    // QR Code scanning is stopped.
    document.getElementById("imagenReferencial").style.display = "block";
    document.getElementById("listaCamaras").value = "";
  }).catch((err) => {
    // Stop failed, handle it.
  });

}

/* para imagenes */

const html5QrCode2 = new Html5Qrcode("reader-file");
// File based scanning
const fileinput = document.getElementById('qr-input-file');
fileinput.addEventListener('change', e => {
  if (e.target.files.length == 0) {
    // No file selected, ignore 
    return;
  }

  const imageFile = e.target.files[0];
  // Scan QR Code
  html5QrCode2.scanFile(imageFile, true)
  .then(lecturaCorrecta)
  .catch(err => {
    // failure, handle it.
    console.log(`Error scanning file. Reason: ${err}`)
  });
});