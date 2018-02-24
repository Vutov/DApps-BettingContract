﻿namespace Admin.Services
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Numerics;
    using System.Threading;
    using System.Threading.Tasks;
    using Data;
    using Models.ContractModels;
    using Nethereum.Contracts;
    using Nethereum.Hex.HexTypes;
    using Nethereum.Util;
    using Nethereum.Web3;
    using Newtonsoft.Json;
    
    public class EventService
    {
        private readonly HexBigInteger _defaultGas = new HexBigInteger(3000000);
        private readonly HexBigInteger _zero = new HexBigInteger(0);

        private readonly Web3 _web3;
        private readonly string _contractName;

        public EventService(string node, string contractName)
        {
            this._web3 = new Web3(node);
            this._contractName = contractName;
        }

        public Result<string> Deploy(params object[] prms)
        {
            return this.Exec(async () =>
            {
                var contract = this.GetContractDefinition();
                var senderAddress = await this.UnlockAccount();
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
                var senderAddress = await this.UnlockAccount();
                var contract = this.GetContract(address);
                await contract.GetFunction("settleBet").SendTransactionAsync(senderAddress, _defaultGas, _zero, winner);
            });
        }

        public Result CloseExpiredEvent(string address)
        {
            return this.Exec(async () =>
            {
                var senderAddress = await this.UnlockAccount();
                var contract = this.GetContract(address);
                await contract.GetFunction("destroyExpiredEvent").SendTransactionAsync(senderAddress, _defaultGas, _zero);
            });
        }

        public string GetSender()
        {
            var address = File.ReadAllLines("../address.txt").First();
            return address;
        }

        public string GetAbi()
        {
            var def = this.GetContractDefinition();
            return def.GetAbi();
        }

        private async Task<string> UnlockAccount()
        {
            var address = this.GetSender();

            // TODO bug in ganache-core dont allow unlocking of accounts - fixed in 2.1.0
            //await _web3.Personal.UnlockAccount.SendRequestAsync(address, "", new HexBigInteger(120));
            return address;
        }

        private Contract GetContract(string address)
        {
            var info = this.GetContractDefinition();
            var contract = _web3.Eth.GetContract(info.GetAbi(), address);

            return contract;
        }

        private ContractMetaInfo GetContractDefinition()
        {
            var json = File.ReadAllText($"../build/contracts/{_contractName}.json");
            return JsonConvert.DeserializeObject<ContractMetaInfo>(json);
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
