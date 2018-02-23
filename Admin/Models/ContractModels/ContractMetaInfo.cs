namespace Admin.Models.ContractModels
{
    public class ContractMetaInfo
    {
        public object Abi { get; set; }
        public string ByteCode { get; set; }

        public string GetAbi()
        {
            return this.Abi.ToString();
        }
    }
}
