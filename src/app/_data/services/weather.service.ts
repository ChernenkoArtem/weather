import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, of, tap } from 'rxjs';
import { CurrentWeather } from '../interfaces/current-weather.interface';

type WeatherCache = {
  [key: string]: CurrentWeather;
};

@Injectable()
export class WeatherService {
  private weatherCacheData: BehaviorSubject<WeatherCache> = new BehaviorSubject(
    {}
  );

  constructor(private http: HttpClient) {}

  set weatherCache(value: WeatherCache) {
    this.weatherCacheData.next(value);
  }

  get weatherCache(): WeatherCache {
    return this.weatherCacheData.getValue();
  }

  getTodeyWeather(cityName: string): Observable<CurrentWeather | null> {
    const cityCache = this.weatherCache[cityName];
    if (!cityCache) {
      return this.fetchTodeyWeather(cityName);
    }

    return of(cityCache);
  }

  fetchTodeyWeather(cityName: string): Observable<CurrentWeather | null> {
    let params = new HttpParams();
    params = params.append('q', cityName);

    return this.http
      .get<CurrentWeather>('current.json', { params: params })
      .pipe(
        filter((v) => !!v),
        tap((watherData: CurrentWeather) => {
          this.weatherCache = { ...this.weatherCache, [cityName]: watherData };
        }),
        catchError(({ error }) => {
          alert(error.error.message);
          return of(null);
        })
      );
  }
}
