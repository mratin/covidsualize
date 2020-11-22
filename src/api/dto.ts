export interface CountryDto {
    Country: string,
    Slug: string,
    ISO2: string
}

export interface DayOneCountryDto {
    Country: string,
    CountryCode: string,
    Confirmed: number,
    Deaths: number,
    Recovered: number,
    Active: number,
    Lat: string,
    Lon: string,
    Date: string
}