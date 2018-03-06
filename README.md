# DApps-BettingContract
https://softuni.bg/trainings/1885/blockchain-dev-camp-sofia-february-2018

Traditional betting requires a sportsbook, but what if customers could bet against one an other without been worried the other side will not honor the bet?
Have full transparency and win with your favorite team.

This solution has 3 main parts.
 <img src="https://dappadmin.azurewebsites.net/images/schema.png">
 
 Ethereum Smart Contract - all business logic is inside. The Smart Contract is made to work with Oracle. For the service of giving the result, the Oracle is rewarded with 10% of the losings.
 If the Event is Settled, no more bets are allowed. Once the Event expires after 7 days any Ethers left can be collected from the Administration application.
 
 Administration application - used for creating events, settling them and destroying the contracts after expiration.
 
 Betting UI - used for placing bets and collecting winnings. No registration required, only MetaMask Wallet.
 
 General flow - Event is created. New Bets are accepted until the event is settled. After the event is settled the winners can collect their winnings for period of 7 days. After that the Smart Contract can be self-destructed.
 Bets can be placed on team1, team2 or draw. The "winnings" are based on the "losses".
 Example - Team1 wins, the losses are everything placed for team2 and draw. First Oracle is rewarded 10% of that, afterwards the winnings are % of the losses. The winner % depends on the % of all bets for the winning team. If 1 ethers is placed and the total placed ethers for theam1 are 10, then the % is 1/10 = 0.1%, the winner will get his\her 1 ethers back and extra 0.9 ethers (90% of 10 = 9, 10% of 9 = 0.9).
 
 Everything is hosted in Azure and works with Ropsten (Ethereum testnet):
 Administration Application: https://dappadmin.azurewebsites.net/ (user credentials: admin@admin.admin / K832]wzD9A9aY, key is private key of Ropsten wallet - it is not stored anywhere)
 Betting Application: https://dappsui.azurewebsites.net/ (only MetaMask is required for placing bets)
