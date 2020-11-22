import Axios, { AxiosResponse } from 'axios';
import { CountryDto, DayOneCountryDto } from './dto';

const baseUrl = "https://api.covid19api.com"

export const getCountries: () => Promise<AxiosResponse<CountryDto[]>> = () => Axios.get(`${baseUrl}/countries`);

export const getCountryDays: (slug: string) => Promise<AxiosResponse<DayOneCountryDto[]>> = (slug: string) => Axios.get(`${baseUrl}/dayone/country/${slug}`);