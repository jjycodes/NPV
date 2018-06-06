using System;
using BusinessLogic.Services;
using System.Collections.Generic;
using Xunit;

namespace Tests
{
    public class NPVTests
    {
        /// <summary>
        /// Tests are based from this source : https://www.investopedia.com/ask/answers/032615/what-formula-calculating-net-present-value-npv.asp
        /// </summary>
        [Fact]
        public void GivenVaryingCashFlowsWhenComputingNPVThenSuccessfullyReturnsCorrectNPV()
        {
            var cashFlows = new List<double>() {35000, 10000, 27000, 19000};

            var npvService = new NPVCalculationService();
            var npv = npvService.ComputeNPV(cashFlows, .12);

            Assert.Equal(8976, Math.Truncate(npv));
        }

        [Fact]
        public void GivenEvenCashFlowsWhenComputingNPVThenSuccessfullyReturnsCorrectNPV()
        {
            var cashFlows = new List<double>() { 35000, 27000, 27000 };
            var npvService = new NPVCalculationService();
            var npv = npvService.ComputeNPV(cashFlows, .12);

            Assert.Equal(10631, Math.Truncate(npv));
        }
    }
}
