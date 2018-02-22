namespace Admin.Services
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using Data;
    using Nethereum.Hex.HexTypes;
    using Nethereum.Web3;

    public class EventService
    {
        private string _node;

        public EventService(string node)
        {
            _node = node;
        }

        public async Task<Result> CreateEvent(InvoiceDbContext context, string homeTeamName, string awayTeamName)
        {
            // TODO read from drive
            var senderAddress = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
            var oracle = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
            var abi = @"[{""constant"": false,""inputs"": [{""name"": ""num"",""type"": ""uint256""}],""name"": ""set"",""outputs"": [],""payable"": false,""stateMutability"": ""nonpayable"",""type"": ""function""},{""constant"": true,""inputs"": [],""name"": ""get"",""outputs"": [{""name"": ""num"",""type"": ""uint256""}],""payable"": false,""stateMutability"": ""view"",""type"": ""function""}]";
            var byteCode =
                "0x6060604052341561000f57600080fd5b60d38061001d6000396000f3006060604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606e575b600080fd5b3415605857600080fd5b606c60048080359060200190919050506094565b005b3415607857600080fd5b607e609e565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a72305820885c3a34eef4c2f1cfce7d0149f0f4cbfc45b79eef56b0a31ca99e24691eea700029";

            var web3 = new Web3(_node);
            string contractAddress;
            try
            {
                var transactionHash = await web3.Eth.DeployContract.SendRequestAsync(abi, byteCode, senderAddress, new HexBigInteger(900000));

                var receipt = await web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash);

                while (receipt == null)
                {
                    Thread.Sleep(1000);
                    receipt = await web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash);
                }

                contractAddress = receipt.ContractAddress;
            }
            catch (Exception ex)
            {
                return Result.Fail(ex.ToString());
            }

            // TODO ef save in db
            
            return Result.Ok();
        }
    }
}
