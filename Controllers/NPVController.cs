using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NPV.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NPV.Controllers
{
    [Route("api/[controller]")]
    public class NPVController : Controller
    {
        // GET: api/<controller>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        [HttpPost("{data}")]
        public async Task<IEnumerable<RateNPV>> ComputeValue([FromBody] NPVParameters data)
        {
            return await ComputeValueAsync(data);
        }

        private async Task<IEnumerable<RateNPV>> ComputeValueAsync(NPVParameters data)
        {
            var tasks = new List<Task<KeyValuePair<double, double>>>();

            for (double rate = data.LowerBoundDiscountRate;
                rate <= data.UpperBoundDiscountRate;
                rate += data.DiscountRateIncrement)
            {
                var ratePercent = rate / 100;
                var NPVTask = Task.Factory.StartNew(b => ComputeNPV(data.CashFlows, (double)b), ratePercent);
                tasks.Add(NPVTask);

            }

            var continuation = await Task.WhenAll(tasks);
            var npvRates = new List<RateNPV>();
            npvRates.AddRange(
                continuation.Select(x =>
                new RateNPV()
                {
                    Rate = Math.Round(x.Key * 100, 2),
                    NPV = Math.Round(x.Value, 2)
                }));
            
            return npvRates;
        }


        private KeyValuePair<double, double> ComputeNPV(IEnumerable<double> cashflows, double rate)
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

            return new KeyValuePair<double, double>(rate, periodSums);
        }

        private double ComputeVaryingPeriodValue(double cashFlow, double rate, int periodNo)
        {
            return cashFlow / Math.Pow(1 + rate, periodNo);
        }

        private double ComputeEqualPeriodValue(double cashFlow, double rate, int totalPeriods)
        {
            return cashFlow * (1 - Math.Pow(1 + rate, -totalPeriods)) / rate;
        }
        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
