document.addEventListener('DOMContentLoaded', cargarInformacionGeneral);

function cargarInformacionGeneral() {
  fetch('https://www.el-tiempo.net/api/json/v2/home')
    .then(response => response.json())
    .then(data => {
      const today = data.today ? data.today.temperatura : 'No disponible';
      const tomorrow = data.tomorrow ? data.tomorrow.temperatura : 'No disponible';

      document.getElementById('info-general').innerHTML = `
        <p>Previsión para hoy: ${today}</p>
        <p>Previsión para mañana: ${tomorrow}</p>
      `;

      cargarProvincias(data.provincias);
    })
    .catch(error => console.error('Error al obtener información general:', error));
}

function cargarProvincias(provincias) {
  const provinciaSelect = document.getElementById('provincia-select');
  provinciaSelect.innerHTML = '<option value="">Seleccionar Provincia</option>';

  provincias.forEach(provincia => {
    const option = document.createElement('option');
    option.value = provincia.CODPROV;
    option.textContent = provincia.NOMBRE_PROVINCIA;
    provinciaSelect.appendChild(option);
  });

  // Agrega un listener para el cambio en la selección de provincia
  provinciaSelect.addEventListener('change', () => {
    const codigoProvincia = provinciaSelect.value;
    if (codigoProvincia) {
      cargarPrevisionProvincia(codigoProvincia);
    }
  });
}

function cargarPrevisionProvincia(codigoProvincia) {
  fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${codigoProvincia}`)
    .then(response => response.json())
    .then(data => {
      const today = data.today ? data.today.temperatura : 'No disponible';
      const tomorrow = data.tomorrow ? data.tomorrow.temperatura : 'No disponible';

      document.getElementById('info-general').innerHTML = `
        <p>Previsión para hoy en ${data.NOMBRE_PROVINCIA}: ${today}</p>
        <p>Previsión para mañana en ${data.NOMBRE_PROVINCIA}: ${tomorrow}</p>
      `;

      cargarMunicipios(data.municipios);
    })
    .catch(error => console.error('Error al obtener previsión de la provincia:', error));
}

function cargarMunicipios(municipios) {
  const municipioSelect = document.getElementById('municipio-select');
  municipioSelect.innerHTML = '<option value="">Seleccionar Municipio</option>';

  municipios.forEach(municipio => {
    const option = document.createElement('option');
    option.value = municipio.CODIGOINE.substring(0, 5);
    option.textContent = municipio.NOMBRE;
    municipioSelect.appendChild(option);
  });
}


function cargarMunicipiosSelect(municipios) {
  const municipioSelect = document.getElementById('municipio-select');
  municipioSelect.innerHTML = '<option value="">Seleccionar Municipio</option>';

  municipios.forEach(municipio => {
    const option = document.createElement('option');
    option.value = municipio.CODIGOINE.substring(0, 5);
    option.textContent = municipio.NOMBRE;
    municipioSelect.appendChild(option);
  });
}

function cargarDatosMunicipio() {
  const municipioSelect = document.getElementById('municipio-select');
  const codigoMunicipio = municipioSelect.value;

  if (!codigoMunicipio) {
    return;
  }

  fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${codigoMunicipio.substring(0, 2)}/municipios/${codigoMunicipio}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('datos-municipio').innerHTML = `
        <p>Temperatura Máxima: ${data.temperaturas.max}</p>
        <p>Temperatura Mínima: ${data.temperaturas.min}</p>
        <p>Estado del Cielo: ${data.estadoCielo}</p>
      `;
    })
    .catch(error => console.error('Error al obtener datos del municipio:', error));
}
