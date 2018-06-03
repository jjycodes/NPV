using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NPV.Models
{
    public class NPVParameters
    {
        public double[] CashFlows { get; set; }
        public int UpperBoundDiscountRate { get; set; }
        public int LowerBoundDiscountRate { get; set; }
        public double DiscountRateIncrement { get; set; }
    }
}
