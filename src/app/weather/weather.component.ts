import { Component } from '@angular/core';
import { CONSTANTS } from '@app/_data/constants';
import { CurrentWeather } from '@app/_data/interfaces/current-weather.interface';
import { WeatherService } from '@app/_data/services/weather.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent {
  cities = CONSTANTS.cities;
  tempTypes = CONSTANTS.types;
  selectType = CONSTANTS.types[0].value;
  weatherData?: CurrentWeather | null;
  selectedCity!: string;

  set selectValue(value: string) {
    this.selectedCity = value;
    this.updateDataByCity();
  }

  get selectValue(): string {
    return this.selectedCity;
  }

  constructor(private weatherService: WeatherService) {}

  updateDataByCity(): void {
    firstValueFrom(this.weatherService.getTodeyWeather(this.selectedCity)).then(
      (value) => (this.weatherData = value)
    );
  }
}
