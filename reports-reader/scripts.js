async function printFiles(e) {
  const files = e.target.files;
  for (let file of files) {
    try {
      const text = await file.text();
      const parsedData = JSON.parse(text);

      const header = document.getElementById('weather');
      if (header) document.body.removeChild(header);

      createReport(parsedData);
    } catch (error) {
      alert(`Произошла ошибка ${error.name}!`);
    }
  }
}

function createReport(data) {
  const baseDiv = document.createElement('div');
  baseDiv.id = 'weather';

  const cityInfo = `
  <br />
  <div>
  <div>Город: ${data.city}</div>
  <div>Страна: ${data.country}</div>
  <div>Широта: ${data.latitude}</div>
  <div>Долгота: ${data.longitude}</div>
  </div>`;

  const tableHeader = `<br />
  <table>
  <thead>
  <tr>
    <th>Дата</th>
    <th>Мин. температура</th>
    <th>Макс. температура</th>
    <th>Сумм. осадки</th>
  </tr>
  </thead>
  <tbody>`;

  let tableBody = ``;
  for (let index = 0; index < data.weather.length; index++) {
    const dayWeather = data.weather[index];
    tableBody += `<tr>
    <td class="tdCenter">${getDate(dayWeather.date)}</td>
    <td class="tdRight">${dayWeather.minTemperature} °C</td>
    <td class="tdRight">${dayWeather.maxTemperature} °C</td>
    <td class="tdRight">${dayWeather.sumPrecipitation} мм</td>
    </tr>`;
  }

  const tableClose = `</tbody> </table>`;
  baseDiv.innerHTML = cityInfo + tableHeader + tableBody + tableClose;
  document.body.appendChild(baseDiv);
}

function getDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

document.getElementById('selectFile').addEventListener('change', printFiles);
