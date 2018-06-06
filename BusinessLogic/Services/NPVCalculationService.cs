using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessLogic.Services
{
    public class NPVCalculationService : INPVCalculationService
    {
        public double ComputeNPV(IEnumerable<double> cashflows, double rate)
        {
            var firstCashFlow = cashflows.First(); //this will be deducted after all the summation
            var revenues = cashflows.ToList();
            revenues.RemoveAt(0);

            double periodSums = 0;

            //check if varying cashflows
            var firstRevenue = revenues.First();
            if (revenues.All(c => c == firstRevenue))
            {
                periodSums = ComputeEqualPeriodValue(firstRevenue, rate, revenues.Count());
            }
            else
            {
                for (int i = 0; i < revenues.Count(); i++)
                {
                    periodSums += ComputeVaryingPeriodValue(revenues[i], rate, i + 1);
                }
            }

            periodSums -= firstCashFlow;
            return periodSums;
        }

        private double ComputeVaryingPeriodValue(double cashFlow, double rate, int periodNo)
        {
            return cashFlow / Math.Pow(1 + rate, periodNo);
        }

        private double ComputeEqualPeriodValue(double cashFlow, double rate, int totalPeriods)
        {
            return cashFlow * (1 - Math.Pow(1 + rate, -totalPeriods)) / rate;
        }
    }
}
