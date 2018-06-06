using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLogic.Services
{
    public interface INPVCalculationService
    {
        double ComputeNPV(IEnumerable<double> cashflows, double rate);
    }
}
