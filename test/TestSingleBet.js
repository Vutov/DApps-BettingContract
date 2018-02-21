var SingleBet = artifacts.require("SingleBet");

contract('SingleBet', function (accounts) {

  let instance;
  const initialParams = {
    _oracle: accounts[1],
    _homeTeamName: "Arsenal",
    _awayTeamName: "Manchester United",
  };

  describe("create token", () => {
    beforeEach(async function () {
      instance = await SingleBet.new(...Object.values(initialParams), {
        from: accounts[0]
      });
    });

    describe("getBetMetaInfo", () => {
      it("should have correct team names when created", async function () {
        // arrange
        let now = new Date();
        let expiration = now.setDate(now.getDate() + 7) // 7 days after creation

        // act
        let data = await instance.getBetMetaInfo();

        // assert
        assert.equal(true, data[0], "Bet is not open");
        assert.equal(initialParams._homeTeamName, data[1]);
        assert.equal(initialParams._awayTeamName, data[2]);
        let contractExpiration = Number(data[3].toString()) * 1000;
        let diff = expiration - contractExpiration;
        assert.isAbove(diff, 0);
        assert.isBelow(diff, 1000); // 'now' created before contact
      });
    });

    describe("settleBet", () => {
      it("should return error when NOT Oracle", async function () {
        // arrange

        // act
        try {
          await instance.settleBet(2, {
            from: accounts[3]
          });
        } catch (ex) {
          assert.isNotNull(ex);
        }

        // assert
        assert.ok(true);
      });

      it("should set as settled when Oracle", async function () {
        // arrange
        let winner = 1;

        // act       
        await instance.settleBet(winner, {
          from: initialParams._oracle
        });
        let data = await instance.getBetMetaInfo();

        // assert
        assert.equal(false, data[0], "Bet is open");
      });

      it("should get paid 10% of losings when Oracle", async function () {
        // arrange
        let startBalance = web3.eth.getBalance(initialParams._oracle).toString();

        // act
        await instance.bet(1, {
          from: accounts[5],
          value: web3.toWei(2, 'ether')
        })
        await instance.bet(2, {
          from: accounts[6],
          value: web3.toWei(1, 'ether')
        })
        await instance.bet(3, {
          from: accounts[6],
          value: web3.toWei(1, 'ether')
        })
        await instance.settleBet(1, {
          from: initialParams._oracle
        });

        // assert
        let endBalance = web3.eth.getBalance(initialParams._oracle).toString();
        let diff = web3.fromWei(endBalance, 'ether') - web3.fromWei(startBalance, 'ether');
        assert.isAbove(diff, 0.19);
      });

      it("should get paid 10% of losings when Oracle no betters", async function () {
        // arrange
        let startBalance = web3.eth.getBalance(initialParams._oracle).toString();

        // act
        await instance.settleBet(1, {
          from: initialParams._oracle
        });

        // assert
        let endBalance = web3.eth.getBalance(initialParams._oracle).toString();
        let diff = web3.fromWei(endBalance, 'ether') - web3.fromWei(startBalance, 'ether');
        assert.isBelow(diff, 0); // gas money
      });
    });

    describe("getWinner", () => {
      it("should return error when NOT settled", async function () {
        // arrange

        // act
        try {
          let winner = await instance.getWinner();
        } catch (ex) {
          assert.isNotNull(ex);
        }

        // assert
        assert.ok(true);
      });

      it("should return winner when settled", async function () {
        // arrange
        let winner = 1;
        await instance.settleBet(winner, {
          from: initialParams._oracle
        });

        // act
        let result = await instance.getWinner();

        // assert

        let data = await instance.getBetMetaInfo();
        assert.equal(false, data[0], "Bet is open");
        assert.equal(winner, result)
      });
    });

    describe("bet", () => {
      it("should NOT be allowed when settled", async function () {
        // arrange
        await instance.settleBet(1, {
          from: initialParams._oracle
        });

        // act
        try {
          await instance.bet(1, {
            from: accounts[4],
            value: web3.toWei(2, 'ether')
          })
        } catch (ex) {
          assert.isNotNull(ex);
        }

        // assert
        assert.ok(true);
      });

      let choiceTests = [
        { choice: 1, bet: 2 },
        { choice: 2, bet: 5 },
        { choice: 3, bet: 1 }
      ];

      choiceTests.forEach(async function (test) {
        it("should accept bet when open choice " + test.choice, async function () {
          // arrange
          let betChoice = test.choice;
          let betEthers = test.bet;
          let betAmount = web3.toWei(betEthers, 'ether');
          let acc = accounts[4];

          // act
          await instance.bet(betChoice, {
            from: acc,
            value: betAmount
          })

          // assert 
          let money = await instance.checkTotalBalance();
          let moneyEthers = web3.fromWei(money, 'ether').c;
          assert.equal(moneyEthers, betEthers)

          let placedBets = await instance.getBets(acc);
          let placedMoney = placedBets[betChoice - 1]; // 0 based array
          let placedMoneyEthers = web3.fromWei(placedMoney, "ether").c;
          assert.equal(placedMoneyEthers, betEthers);
        });
      });
      it("should accept multiple bets", async function () {
        // arrange
        let acc = accounts[5];

        let choices = [1, 1, 3, 2, 1]
        let bets = [1, 2, 3, 2, 5]
        let totalByChoice = [8, 2, 3];

        // act
        for (let i = 0; i < bets.length; i++) {
          let betChoice = choices[i];
          let betAmount = web3.toWei(bets[i], 'ether');
          await instance.bet(betChoice, {
            from: acc,
            value: betAmount
          })
        }

        // assert 
        let money = await instance.checkTotalBalance();
        let moneyEthers = web3.fromWei(money, 'ether').c;
        assert.equal(moneyEthers, bets.reduce((a, b) => a + b, 0));

        let placedBets = await instance.getBets(acc);
        [1, 2, 3].forEach(function (choice) {
          let placedMoney = placedBets[choice - 1]; // 0 based array
          let placedMoneyEthers = web3.fromWei(placedMoney, "ether").c;
          assert.equal(placedMoneyEthers, totalByChoice[choice - 1]); // 0 based array
        })
      });

      it("should accept multiple bets when different accounts", async function () {
        // arrange
        let betAmount1 = web3.toWei(1, 'ether');
        let betAmount2 = web3.toWei(2, 'ether');

        // act
        await instance.bet(1, {
          from: accounts[4],
          value: betAmount1
        })

        await instance.bet(2, {
          from: accounts[5],
          value: betAmount2
        })

        // assert 
        let money = await instance.checkTotalBalance();
        let moneyEthers = web3.fromWei(money, 'ether').c;
        assert.equal(3, moneyEthers)
      });

      it("should return error when invalid choice", async function () {
        // arrange

        // act
        try {
          await instance.bet(4);
        } catch (ex) {
          assert.isNotNull(ex);
        }

        // assert 
        assert.ok(true);
      });
    });

    describe("getPossibleWinnig", () => {
      it("should get possible winning", async function () {
        // arrange
        let amount = web3.toWei(9, 'ether');

        // act
        await instance.bet(1, {
          from: accounts[7],
          value: web3.toWei(0.5, 'ether')
        })
        await instance.bet(2, {
          from: accounts[8],
          value: web3.toWei(0.5, 'ether')
        })
        await instance.bet(3, {
          from: accounts[9],
          value: web3.toWei(1, 'ether')
        })

        let winnings = await instance.getPossibleWinnig.call(3, amount);

        // assert
        // price 1 ether, 10% for Oracle => 0.9, winners 1 + 9 ether => 90% for current amount
        assert.equal(web3.fromWei(winnings.toString(), 'ether'), 0.81);
      });

      it("should get possible winning 2", async function () {
        // arrange
        let amount = web3.toWei(1, 'ether');

        // act
        await instance.bet(1, {
          from: accounts[7],
          value: web3.toWei(0.2, 'ether')
        })
        await instance.bet(2, {
          from: accounts[8],
          value: web3.toWei(0.0001, 'ether')
        })
        await instance.bet(2, {
          from: accounts[6],
          value: web3.toWei(0.002, 'ether')
        })
        await instance.bet(3, {
          from: accounts[9],
          value: web3.toWei(0.05, 'ether')
        })

        let winnings = await instance.getPossibleWinnig.call(1, amount);

        // assert
        // price 0.0521 ether, 10% for Oracle => 0.00521, winners 1 + 0.2 ether => 83.33% for current amount
        assert.equal(web3.fromWei(winnings.toString(), 'ether'), 0.039073437);
      });

      it("should get possible winning 3", async function () {
        // arrange
        let amount = web3.toWei(0.5, 'Gwei');

        // act
        await instance.bet(1, {
          from: accounts[7],
          value: web3.toWei(0.2, 'Szabo')
        })
        await instance.bet(2, {
          from: accounts[8],
          value: web3.toWei(1, 'Gwei')
        })
        await instance.bet(2, {
          from: accounts[6],
          value: web3.toWei(2, 'Gwei')
        })
        await instance.bet(3, {
          from: accounts[9],
          value: web3.toWei(0.05, 'Szabo')
        })

        let winnings = await instance.getPossibleWinnig(2, amount);

        // assert
        // price 250000000000 wei, 10% for Oracle => 25000000000, winners 3500000000 wei => 14.28% for current amount
        assert.equal(winnings.toString(), 32130000000);
      });
    });

    describe("collectWinnigs", () => {
      it("should return error when nothing to get", async function () {
        // arrange
        let ex = null;
        await instance.settleBet(1, {
          from: initialParams._oracle
        });

        // act
        try {
          await instance.collectWinnigs();
        } catch (e) {
          ex = e
        }

        // assert
        assert.isNotNull(ex);
      });

      it("should return error when event not settled", async function () {
        // arrange
        let ex = null;
        await instance.bet(1, {
          from: accounts[3],
          value: web3.toWei(2, 'kwei')
        })

        // act
        try {
          await instance.collectWinnigs({
            from: accounts[3]
          });
        } catch (e) {
          ex = e
        }

        // assert
        assert.isNotNull(ex);
      });

      it("should return error when trying to get payed more than once", async function () {
        // arrange
        let ex = null;
        await instance.bet(1, {
          from: accounts[3],
          value: web3.toWei(2, 'kwei')
        })
        await instance.settleBet(1, {
          from: initialParams._oracle
        });

        // act
        await instance.collectWinnigs({
          from: accounts[3]
        });
        try {
          await instance.collectWinnigs({
            from: accounts[3]
          });
        } catch (e) {
          ex = e
        }

        // assert
        assert.isNotNull(ex);
      });

      it("should return bet amount when no other has betted against", async function () {
        let acc = accounts[3];
        await instance.bet(1, {
          from: acc,
          value: web3.toWei(2, 'gwei')
        })
        await instance.settleBet(1, {
          from: initialParams._oracle
        });

        let startBalance = web3.eth.getBalance(acc).toString();

        // act
        let result = await instance.collectWinnigs({
          from: acc
        });

        // assert
        let endBalance = web3.eth.getBalance(acc).toString();
        let usedGas = result.receipt.gasUsed * web3.toWei(100, "Gwei") + 20000;
        let winnings = endBalance - startBalance + usedGas;

        // winnig should be 0 gwei, 2 gwei initial bet 
        // with the gas compensation should be above 2 gwei
        assert.isAbove(winnings, web3.toWei(2, 'gwei'));
        assert.isBelow(winnings, web3.toWei(2.1, 'gwei'));
      });

      it("should return bet amount with percentage of losings", async function () {
        let acc = accounts[3];
        let amount = web3.toWei(2, 'gwei');
        await instance.bet(1, {
          from: acc,
          value: amount
        })
        await instance.bet(2, {
          from: accounts[4],
          value: web3.toWei(5, 'gwei')
        })
        await instance.settleBet(1, {
          from: initialParams._oracle
        });

        let startBalance = web3.eth.getBalance(acc).toString();

        // act
        let result = await instance.collectWinnigs({
          from: acc
        });

        // assert
        let endBalance = web3.eth.getBalance(acc).toString();
        let usedGas = result.receipt.gasUsed * web3.toWei(100, "Gwei") + 20000;
        let winnings = endBalance - startBalance + usedGas;

        // winnig should be 4.5 gwei 2 gwei initial bet 
        // with the gas compensation should be above 6.5 gwei
        assert.isAbove(winnings, web3.toWei(6.5, 'gwei'));
        assert.isBelow(winnings, web3.toWei(6.51, 'gwei'));
      });

      it("should return bet amount with percentage of losings complex", async function () {
        let acc = accounts[3];
        let amount = web3.toWei(2, 'gwei');
        await instance.bet(1, {
          from: acc,
          value: amount
        })
        await instance.bet(2, {
          from: accounts[4],
          value: web3.toWei(5, 'gwei')
        })
        await instance.bet(3, {
          from: accounts[8],
          value: web3.toWei(1, 'gwei')
        })
        await instance.settleBet(1, {
          from: initialParams._oracle
        });

        let startBalance = web3.eth.getBalance(acc).toString();

        // act
        let result = await instance.collectWinnigs({
          from: acc
        });

        // assert
        let endBalance = web3.eth.getBalance(acc).toString();
        let usedGas = result.receipt.gasUsed * web3.toWei(100, "Gwei") + 20000;
        let winnings = endBalance - startBalance + usedGas;

        // winnig should be 5.4 gwei 2 gwei initial bet 
        // with the gas compensation should be above 7.4 gwei
        assert.isAbove(winnings, web3.toWei(7.4, 'gwei'));
        assert.isBelow(winnings, web3.toWei(7.41, 'gwei'));
      });

      it("should return bet amount with percentage of losings complex 2", async function () {
        let acc = accounts[3];
        let amount = web3.toWei(2, 'gwei');
        await instance.bet(1, {
          from: acc,
          value: amount
        })
        await instance.bet(2, {
          from: accounts[4],
          value: web3.toWei(5, 'gwei')
        })
        await instance.bet(1, {
          from: accounts[5],
          value: web3.toWei(6, 'gwei')
        })
        await instance.bet(3, {
          from: accounts[6],
          value: web3.toWei(1, 'gwei')
        })
        await instance.bet(2, {
          from: accounts[7],
          value: web3.toWei(8, 'gwei')
        })
        await instance.bet(1, {
          from: accounts[7],
          value: web3.toWei(1, 'gwei')
        })
        await instance.bet(3, {
          from: accounts[8],
          value: web3.toWei(3, 'gwei')
        })
        await instance.settleBet(1, {
          from: initialParams._oracle
        });

        let startBalance = web3.eth.getBalance(acc).toString();

        // act
        let result = await instance.collectWinnigs({
          from: acc
        });

        // assert
        let endBalance = web3.eth.getBalance(acc).toString();
        let usedGas = result.receipt.gasUsed * web3.toWei(100, "Gwei") + 20000;
        let winnings = endBalance - startBalance + usedGas;

        // winnigs should be 17, after oracle 15.3
        // betters on winnig 9, initial bet % = 22.22%
        // with the gas compensation should be above 3.39966 + 2 = 5.39966
        assert.isAbove(winnings, web3.toWei(5.39966, 'gwei'));
        assert.isBelow(winnings, web3.toWei(5.4, 'gwei'));
      });
    });
  });
});