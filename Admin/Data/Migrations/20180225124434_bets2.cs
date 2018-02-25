using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Admin.Data.Migrations
{
    public partial class bets2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bet_Events_EventID",
                table: "Bet");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Bet",
                table: "Bet");

            migrationBuilder.RenameTable(
                name: "Bet",
                newName: "Bets");

            migrationBuilder.RenameIndex(
                name: "IX_Bet_EventID",
                table: "Bets",
                newName: "IX_Bets_EventID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Bets",
                table: "Bets",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Bets_Events_EventID",
                table: "Bets",
                column: "EventID",
                principalTable: "Events",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bets_Events_EventID",
                table: "Bets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Bets",
                table: "Bets");

            migrationBuilder.RenameTable(
                name: "Bets",
                newName: "Bet");

            migrationBuilder.RenameIndex(
                name: "IX_Bets_EventID",
                table: "Bet",
                newName: "IX_Bet_EventID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Bet",
                table: "Bet",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Bet_Events_EventID",
                table: "Bet",
                column: "EventID",
                principalTable: "Events",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
