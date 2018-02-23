namespace Admin.Models.ContractModels
{
    using System.Numerics;
    using Nethereum.ABI.FunctionEncoding.Attributes;

    [FunctionOutput]
    public class EventInfo
    {
        [Parameter("bool", 1)]
        public bool IsOpen { get; set; }

        [Parameter("string", 2)]
        public string HomeTeamName { get; set; }

        [Parameter("string", 3)]
        public string AwayTeamName { get; set; }

        [Parameter("uint", 4)]
        public BigInteger ExpireAt { get; set; }
    }
}
