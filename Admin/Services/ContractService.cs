namespace Admin.Services
{
    using System.IO;
    using Models.ContractModels;
    using Newtonsoft.Json;

    public class ContractService
    {
        private readonly string _contractName;

        public ContractService(string name)
        {
            _contractName = name;
        }

        public ContractMetaInfo GetContractDefinition()
        {
            var json = File.ReadAllText($"./ContractDefinitions/{_contractName}.json");
            return JsonConvert.DeserializeObject<ContractMetaInfo>(json);
        }
    }
}
