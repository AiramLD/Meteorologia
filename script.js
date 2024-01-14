// LLAMADAS A FUNCIONES
cargarInformacionGeneral();

function cargarInformacionGeneral() {
  fetch("https://www.el-tiempo.net/api/json/v2/home")
    .then((response) => response.json())
    .then((data) => {
      const today = data.today.p;
      const tomorrow = data.tomorrow.p;

      const divToday = document.getElementById("today");
      const divTomorrow = document.getElementById("tomorrow");

      today.forEach((item) => {
        const p = document.createElement("p");
        p.innerText = item;
        divToday.appendChild(p);
      });

      tomorrow.forEach((item) => {
        const p = document.createElement("p");
        p.innerText = item;
        divTomorrow.appendChild(p);
      });

      cargarProvincias(data.provincias);
    })
    .catch((error) =>
      console.error("Error al obtener información general:", error)
    );
}

function cargarProvincias(provincias) {
  const provinciaSelect = document.getElementById("provincia-select");
  provinciaSelect.innerHTML = '<option value="">Seleccionar Provincia</option>';

  provincias.forEach((provincia) => {
    const option = document.createElement("option");
    option.value = provincia.CODPROV;
    option.textContent = provincia.NOMBRE_PROVINCIA;
    provinciaSelect.appendChild(option);
  });
}

function cargarPrevisionProvincia(codigoProvincia) {
  fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${codigoProvincia}`)
    .then((response) => response.json())
    .then((data) => {
      const today = data.today.p;
      const tomorrow = data.tomorrow.p;

      const divToday = document.getElementById("today");
      const divTomorrow = document.getElementById("tomorrow");

      const parrafosToday = divToday.getElementsByTagName("p");
      const parrafosTomorrow = divTomorrow.getElementsByTagName("p");

      for (var i = parrafosToday.length - 1; i >= 0; i--) {
        parrafosToday[i].parentNode.removeChild(parrafosToday[i]);
      }

      for (var i = parrafosTomorrow.length - 1; i >= 0; i--) {
        parrafosTomorrow[i].parentNode.removeChild(parrafosTomorrow[i]);
      }

      const pToday = document.createElement("p");
      pToday.innerText = today;
      divToday.appendChild(pToday);

      const pTomorrow = document.createElement("p");
      pTomorrow.innerText = tomorrow;
      divTomorrow.appendChild(pTomorrow);

      cargarMunicipios(data.provincia.CODPROV);
    })
    .catch((error) =>
      console.error("Error al obtener previsión de la provincia:", error)
    );
}

function cargarMunicipios(codProv) {
  fetch(
    `https://www.el-tiempo.net/api/json/v2/provincias/${codProv}/municipios`
  )
    .then((response) => response.json())
    .then((data) => {
      const municipios = data.municipios;

      console.log(municipios);

      const municipioSelect = document.getElementById("municipio-select");
      municipioSelect.innerHTML =
        '<option value="">Seleccionar Municipio</option>';

      municipios.forEach((municipio) => {
        const option = document.createElement("option");
        option.value = municipio.CODIGOINE.substring(0, 5);
        option.textContent = municipio.NOMBRE;

        municipioSelect.appendChild(option);
      });
    });
}

function cargarMunicipiosSelect(municipios) {
  const municipioSelect = document.getElementById("municipio-select");
  municipioSelect.innerHTML = '<option value="">Seleccionar Municipio</option>';

  municipios.forEach((municipio) => {
    const option = document.createElement("option");
    option.value = municipio.CODIGOINE.substring(0, 5);
    option.textContent = municipio.NOMBRE;
    municipioSelect.appendChild(option);
  });
}

function cargarDatosMunicipio() {
  const municipioSelect = document.getElementById("municipio-select");
  const codigoMunicipio = municipioSelect.value;

  if (!codigoMunicipio) {
    return;
  }

  fetch(
    `https://www.el-tiempo.net/api/json/v2/provincias/${codigoMunicipio.substring(
      0,
      2
    )}/municipios/${codigoMunicipio}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("datos-municipio").innerHTML = `
        <p>Temperatura Máxima: ${data.temperaturas.max}</p>
        <p>Temperatura Mínima: ${data.temperaturas.min}</p>
        <p>Estado del Cielo: ${data.stateSky.description}</p>
      `;
    })
    .catch((error) =>
      console.error("Error al obtener datos del municipio:", error)
    );
}

// EVENT LISTENERS
const provinciaSelect = document.getElementById("provincia-select");
const municipioSelect = document.getElementById("municipio-select");

provinciaSelect.addEventListener("change", () => {
  const codigoProvincia = provinciaSelect.value;
  if (codigoProvincia) {
    cargarPrevisionProvincia(codigoProvincia);
  }

  cargarMunicipios();
});

municipioSelect.addEventListener("change", () => {
  cargarDatosMunicipio();
});
