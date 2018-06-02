import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'npv',
    templateUrl: './npv.component.html'
})


export class NPVComponent {
    public parameters: NPVParameters;
    public projects: Project[];

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        //http.get(baseUrl + 'api/SampleData/WeatherForecasts').subscribe(result => {
        //    this.parameters = result.json() as WeatherForecast[];
        //}, error => console.error(error));
        this.parameters = {
            discountRateIncrement: 0.25,
            upperBoundDiscountRate: 15,
            lowerBoundDiscountRate: 1
        }

        this.projects = [
            {
                name: 'X',
                cashFlows: [35000, 10000, 27000, 19000],
                newCashFlow: 0
            },
            {
                name: 'Y',
                cashFlows: [35000, 27000, 27000],
                newCashFlow: 0
            }
        ];
    }

    public addCashFlow(p : Project) {
        if (p.newCashFlow > 0) {
            p.cashFlows.push(p.newCashFlow);
            p.newCashFlow = 0;
        }
    }
}

export interface Project {
    name: string;
    cashFlows: number[];
    newCashFlow: number;
}

export interface NPVParameters {
    upperBoundDiscountRate: number;
    lowerBoundDiscountRate: number;
    discountRateIncrement: number;
}
