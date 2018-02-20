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

        // act
        let data = await instance.getBetMetaInfo();

        // assert
        assert.equal(true, data[0], "Bet is not open");
        assert.equal(initialParams._homeTeamName, data[1]);
        assert.equal(initialParams._awayTeamName, data[2]);
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
    });

    describe("triggerPayout", () => {
      it("should Todo", async function () {
        // arrange

        // act

        // assert

      })
    })

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
          await instance.isNotOver(4);
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

        // act

        // assert
        assert.fail();
      });
    });

    describe("manualGetWinnigs", () => {
      it("should TODO", async function () {
        // arrange

        // act

        // assert
        assert.fail();
      });
    });
    describe("manualSettleBet", () => {
      it("should TODO", async function () {
        // arrange

        // act

        // assert
        assert.fail();
      });
    });
    describe("changeOracle", () => {
      it("should TODO", async function () {
        // arrange

        // act

        // assert
        assert.fail();
      });
    });
    describe("cancleEvent", () => {
      it("should TODO", async function () {
        // arrange

        // act

        // assert
        assert.fail();
      });
    });
  });
});