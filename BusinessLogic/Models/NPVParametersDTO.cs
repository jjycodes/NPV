using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLogic.Models
{
    public class NPVParametersDTO
    {
        public IEnumerable<double> CashFlows { get; set; }
        public double LowerBoundDiscountRate { get; set; }
        public double UpperBoundDiscountRate { get; set; }
        public double DiscountRateIncrement { get; set; }
    }
}
