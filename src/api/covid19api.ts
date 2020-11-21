import Axios, { AxiosResponse } from 'axios';
import { CountryDto } from './dto';

const baseUrl = "http://api.covid19api.com"

export const getCountries: () => Promise<AxiosResponse<CountryDto[]>> = () => Axios.get(`${baseUrl}/countries`);