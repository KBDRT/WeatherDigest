export class Printer{
  #header = [
      'Дата'.padEnd(13),
      'Мин. температура'.padStart(18),
      'Макс. температура'.padStart(18),
      'Сумм. осадки'.padStart(18),
    ].join(' │ ');

  constructor(cityInfo) {
    this.info = cityInfo;
  }

  display() {
    console.log('─'.repeat(this.#header.length));
    this.#printGeoinfo();
    console.log();
    this.#printTableHeader();
    this.#printTableBody();
    console.log('─'.repeat(this.#header.length));
    console.log();
    console.log();
  }

  #printGeoinfo() {
    console.log(`Город: ${this.info.city}`);
    console.log(`Страна: ${this.info.country}`);
    console.log(`Широта: ${this.info.latitude}`);
    console.log(`Долгота: ${this.info.longitude}`);
  }

  #printTableHeader() {
    console.log(this.#header);
    console.log('─'.repeat(this.#header.length));
  }

  #printTableBody() {
    for (const day of this.info.weather) {
      const row = [
          this.#formatDate(day.date).padEnd(13),
          `${day.minTemperature} °C`.padStart(18),
          `${day.maxTemperature} °C`.padStart(18),
          `${day.sumPrecipitation} мм`.padStart(18),
      ].join(' │ ');
      
      console.log(row);
    }
  }

  #formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  }
}
