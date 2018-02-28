namespace Admin.Services
{
    using System;
    using System.Numerics;
    using System.Threading;
    using System.Threading.Tasks;
    using Data;
    using Models.ContractModels;
    using Nethereum.Contracts;
    using Nethereum.Hex.HexTypes;
    using Nethereum.Util;
    using Nethereum.Web3;
    using Nethereum.Web3.Accounts;
    
    public class EventService
    {
        private readonly HexBigInteger _defaultGas = new HexBigInteger(3000000);
        private readonly HexBigInteger _zero = new HexBigInteger(0);

        private readonly Web3 _web3;
        private readonly Account _account;
        private ContractService _contractService;

        public EventService(string privateKey, string node, ContractService contractService)
        {
            this._account = new Account(privateKey);
            this._web3 = new Web3(_account, node);
            this._contractService = contractService;
        }

        public Result<string> Deploy(params object[] prms)
        {
            return this.Exec(async () =>
            {
                var contract = _contractService.GetContractDefinition();
                var senderAddress = _account.Address;
                var transactionHash = await this._web3.Eth.DeployContract.SendRequestAsync(contract.GetAbi(), contract.ByteCode, senderAddress, _defaultGas, prms);

                var receipt = await _web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash);
                while (receipt == null)
                {
                    Thread.Sleep(1000);
                    receipt = await _web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash);
                }

                var contractAddress = receipt.ContractAddress;
                return Result<string>.Ok(contractAddress);
            });
        }

        public Result<EventInfo> GetEventInfo(string address)
        {
           return this.Exec(async () =>
           {
               var contract = this.GetContract(address);
               var getFunction = contract.GetFunction("getBetMetaInfo");
               var resultget = await getFunction.CallDeserializingToObjectAsync<EventInfo>();

               return Result<EventInfo>.Ok(resultget);
           });
        }

        public Result<decimal> GetEventBalance(string address)
        {
            return this.Exec(async () =>
            {
                var contract = this.GetContract(address);
                var contractBalance = await contract.GetFunction("checkTotalBalance").CallAsync<BigInteger>();
                var ethers = Web3.Convert.FromWei(contractBalance, UnitConversion.EthUnit.Ether);
                return Result<decimal>.Ok(ethers);
            });
        }

        public Result SettleBet(string address, int winner)
        {
            return this.Exec(async () =>
            {
                var senderAddress = _account.Address;
                var contract = this.GetContract(address);
                await contract.GetFunction("settleBet").SendTransactionAsync(senderAddress, _defaultGas, _zero, winner);
            });
        }

        public Result CloseExpiredEvent(string address)
        {
            return this.Exec(async () =>
            {
                var senderAddress = _account.Address;
                var contract = this.GetContract(address);
                await contract.GetFunction("destroyExpiredEvent").SendTransactionAsync(senderAddress, _defaultGas, _zero);
            });
        }

        public string GetSender()
        {
            return _account.Address;
        }
        
        private Contract GetContract(string address)
        {
            var info = _contractService.GetContractDefinition();
            var contract = _web3.Eth.GetContract(info.GetAbi(), address);

            return contract;
        }
        
        private Result Exec(Func<Task> func)
        {
            try
            {
                func().Wait();
                return Result.Ok();
            }
            catch (Exception ex)
            {
                return Result.Fail(ex.ToString());
            }
        }

        private Result<T> Exec<T>(Func<Task<Result<T>>> func)
        {
            try
            {
                return func().Result;
            }
            catch (Exception ex)
            {
                return Result<T>.Fail(ex.ToString());
            }
        }
    }
}
