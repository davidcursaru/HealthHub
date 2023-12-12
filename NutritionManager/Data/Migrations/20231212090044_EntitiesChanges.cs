using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NutritionManager.Data.Migrations
{
    /// <inheritdoc />
    public partial class EntitiesChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Calories",
                table: "NutritionLogs");

            migrationBuilder.DropColumn(
                name: "Progress",
                table: "Goals");

            migrationBuilder.DropColumn(
                name: "CaloriesBurned",
                table: "ExerciseLogs");

            migrationBuilder.AddColumn<DateTime>(
                name: "StartGoalDate",
                table: "Goals",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<int>(
                name: "ExerciseDuration",
                table: "ExerciseLogs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StartGoalDate",
                table: "Goals");

            migrationBuilder.AddColumn<int>(
                name: "Calories",
                table: "NutritionLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Progress",
                table: "Goals",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ExerciseDuration",
                table: "ExerciseLogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CaloriesBurned",
                table: "ExerciseLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
