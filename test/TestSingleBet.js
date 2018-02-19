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
  });

  // it("should send coin correctly", function() {
  //   var meta;

  //   // Get initial balances of first and second account.
  //   var account_one = accounts[0];
  //   var account_two = accounts[1];

  //   var account_one_starting_balance;
  //   var account_two_starting_balance;
  //   var account_one_ending_balance;
  //   var account_two_ending_balance;

  //   var amount = 10;

  //   return MetaCoin.deployed().then(function(instance) {
  //     meta = instance;
  //     return meta.getBalance.call(account_one);
  //   }).then(function(balance) {
  //     account_one_starting_balance = balance.toNumber();
  //     return meta.getBalance.call(account_two);
  //   }).then(function(balance) {
  //     account_two_starting_balance = balance.toNumber();
  //     return meta.sendCoin(account_two, amount, {from: account_one});
  //   }).then(function() {
  //     return meta.getBalance.call(account_one);
  //   }).then(function(balance) {
  //     account_one_ending_balance = balance.toNumber();
  //     return meta.getBalance.call(account_two);
  //   }).then(function(balance) {
  //     account_two_ending_balance = balance.toNumber();

  //     assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
  //     assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
  //   });
  // });
});
