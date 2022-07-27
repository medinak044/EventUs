using API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext: IdentityDbContext<AppUser>
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    #region Tables
    public DbSet<Address> Addresses { get; set; }
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<Attendee> Attendees { get; set; }
    public DbSet<CheckListItem> CheckListItems { get; set; }
    public DbSet<City> Cities { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<EventRole> EventRoles { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<State> States { get; set; }
    public DbSet<UserConnection> UserConnections { get; set; }

    #endregion
}