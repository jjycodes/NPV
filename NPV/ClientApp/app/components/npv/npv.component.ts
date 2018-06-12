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

    public barChartLabels: string[] = [];
    public barChartType: string = 'line';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [];

    get isValidLowerBoundRate(): boolean {
        return this.parameters.lowerBoundDiscountRate >= 1 && this.parameters.lowerBoundDiscountRate <= 100;
    }

    get isValidUpperBoundRate(): boolean {
        return this.parameters.upperBoundDiscountRate >= 1 && this.parameters.upperBoundDiscountRate <= 100;
    }

    get isValidRateIncrement(): boolean {
        return this.parameters.discountRateIncrement > 0 && this.parameters.discountRateIncrement <= 1;
    }

    get hasValidParameters(): boolean {
        return this.isValidLowerBoundRate && this.isValidUpperBoundRate && this.isValidRateIncrement;
    }

    public canProceedCompute(project : Project): boolean {
        return project.cashFlows.length >= 2;
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
                ratesnpv: [],
                isEditing: false
            },
            {
                name: 'Y',
                cashFlows: [35000, 27000, 27000],
                newCashFlow: 0,
                ratesnpv: [],
                isEditing: false
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

    public removeProject(index: number) {
        this.projects.splice(index, 1);
    }

    public computeNPV(p: Project) {
        //validate
        if (this.parameters.upperBoundDiscountRate >= this.parameters.lowerBoundDiscountRate
            && this.parameters.discountRateIncrement > 0 && this.parameters.discountRateIncrement < 1
        )
            this.invokeNPVService(p);
    }

    public clearParameters() {
        this.parameters.upperBoundDiscountRate = this.parameters.lowerBoundDiscountRate =
            this.parameters.discountRateIncrement = 0;
    }

    public addProject() {
        let newProject = <Project>{
            name: 'new project',
            isEditing: true,
            cashFlows: [],
            newCashFlow: 0,
            ratesnpv: []
        };

        this.projects.push(newProject);
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

                //set tabular npv results per rate
                p.ratesnpv = npvRates;

                //set visualization labels and data
                this.barChartLabels = p.ratesnpv.map((x) => {
                    return x.rate.toString();
                });

                let chartData = p.ratesnpv.map((x) => {
                    return x.npv.toString();
                });

                let existingChartData = this.barChartData.find(b => {
                    return b.label == 'Project ' + p.name;
                });

                if (existingChartData) {
                    existingChartData.data = chartData;
                } else {
                    this.barChartData.push({
                        data: chartData,
                        label: 'Project ' + p.name
                    });
                }

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
    isEditing: boolean;
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