using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NutritionManager.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemindersSchedulling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReminderMessage",
                table: "Reminders");

            migrationBuilder.RenameColumn(
                name: "ReminderDate",
                table: "Reminders",
                newName: "StartActivity");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndActivity",
                table: "Reminders",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndActivity",
                table: "Reminders");

            migrationBuilder.RenameColumn(
                name: "StartActivity",
                table: "Reminders",
                newName: "ReminderDate");

            migrationBuilder.AddColumn<string>(
                name: "ReminderMessage",
                table: "Reminders",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
