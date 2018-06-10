import { Component, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { ChartsModule } from 'ng2-charts';

@Component({
    selector: 'npv',
    templateUrl: './npv.component.html'
})


export class NPVComponent {
    public parameters: NPVParameters;
    public projects: Project[];

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    constructor(public http: Http, @Inject('BASE_URL') public baseUrl: string) {

        this.parameters = {
            discountRateIncrement: 0.25,
            upperBoundDiscountRate: 15,
            lowerBoundDiscountRate: 1
        }

        this.projects = [
            {
                name: 'X',
                cashFlows: [35000, 10000, 27000, 19000],
                newCashFlow: 0,
                ratesnpv: []
            },
            {
                name: 'Y',
                cashFlows: [35000, 27000, 27000],
                newCashFlow: 0,
                ratesnpv: []
            }
        ];

    }

    public addCashFlow(p: Project) {
        if (p.newCashFlow > 0) {
            p.cashFlows.push(p.newCashFlow);
            p.newCashFlow = 0;
        } else {
            p.newCashFlow = 0;
        }
    }

    public removeCashFlow(p: Project, index: number) {
        p.cashFlows.splice(index, 1);
    }

    public computeNPV(p: Project) {
        //validate
        if (this.parameters.upperBoundDiscountRate >= this.parameters.lowerBoundDiscountRate
            && this.parameters.discountRateIncrement > 0 && this.parameters.discountRateIncrement < 1
        )
            this.invokeNPVService(p);
    }

    private invokeNPVService(p: Project): any {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            cashFlows: p.cashFlows,
            upperBoundDiscountRate: this.parameters.upperBoundDiscountRate,
            lowerBoundDiscountRate: this.parameters.lowerBoundDiscountRate,
            discountRateIncrement: this.parameters.discountRateIncrement
        };

        return this.http.post(this.baseUrl + 'api/NPV/ComputeValue',
            data
            , options)
            .subscribe(result => {
                let npvRates = result.json();
                p.ratesnpv = npvRates;

            }, error => console.error(error));
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleErrorPromise(error: Response | any) {
        console.error(error.message || error);
        //return Prom.reject(error.message || error);
    }
}

interface Project {
    name: string;
    cashFlows: number[];
    newCashFlow: number;
    ratesnpv: RatesNPV[];
}

interface NPVParameters {
    upperBoundDiscountRate: number;
    lowerBoundDiscountRate: number;
    discountRateIncrement: number;
}

interface RatesNPV {
    rate: number;
    npv: number;
}