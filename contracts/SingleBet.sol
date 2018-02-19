pragma solidity ^0.4.17;

contract SingleBet {
    address private owner;
    address private oracle;

    bool private isOpen;
    uint8 private winner;

    string private homeTeamName;
    string private awayTeamName;

    modifier isSettled() {
        require(isOpen == false);
        _;
    }

    event Settle(uint8 wnr);

    function SingleBet(address _oracle, string _homeTeamName, string _awayTeamName) public {
        owner = msg.sender;
        oracle = _oracle;
        homeTeamName = _homeTeamName;
        awayTeamName = _awayTeamName;
        isOpen = true;
    }

    function getBetMetaInfo() public view returns(bool, string, string) {
        return (isOpen, homeTeamName, awayTeamName);
    }

    function getWinner() isSettled public view returns(uint8) {
        return winner;
    }

    function settleBet(uint8 _winner) public {
        require(msg.sender == oracle);
        Settle(_winner);
        isOpen = false;
        winner = _winner;

        // TODO payout
    }
}