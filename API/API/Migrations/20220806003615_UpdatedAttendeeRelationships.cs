using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class UpdatedAttendeeRelationships : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendees_AppUserDto_AppUserId",
                table: "Attendees");

            migrationBuilder.DropTable(
                name: "AppUserDto");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendees_AspNetUsers_AppUserId",
                table: "Attendees",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendees_AspNetUsers_AppUserId",
                table: "Attendees");

            migrationBuilder.CreateTable(
                name: "AppUserDto",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserDto", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Attendees_AppUserDto_AppUserId",
                table: "Attendees",
                column: "AppUserId",
                principalTable: "AppUserDto",
                principalColumn: "Id");
        }
    }
}
