using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NutritionManager.Data.Migrations
{
    /// <inheritdoc />
    public partial class HeartMinutesForExerciseLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HeartMinutes",
                table: "ExerciseLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeartMinutes",
                table: "ExerciseLogs");
        }
    }
}
