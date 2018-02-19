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

    it("should payout when Oracle", async function () {
      assert.fail();
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

      it("should accept bet when open choice 1", async function () {
        // arrange
        let betAmount = web3.toWei(2, 'ether');
        let acc = accounts[4];
        // act
        await instance.bet(1, {
          from: acc,
          value: betAmount
        })

        // assert 
        let money = await instance.checkTotalBalance();
        console.log(betAmount);
        console.log(money);
        let placedBets = await instance.getBets(acc);
        console.log(placedBets);
        assert.fail();
      });

      it("should accept bet when open choice 2", async function () {
        // arrange

        // act

        // assert 
        assert.fail();
      });

      it("should accept bet when open multiple bets", async function () {
        // arrange

        // act

        // assert 
        assert.fail();
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