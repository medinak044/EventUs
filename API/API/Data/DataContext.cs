using API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext: IdentityDbContext<AppUser>
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    #region Tables
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<State> States { get; set; } // States (List of available states)
    public DbSet<City> Cities { get; set; } // Cities (If possible, associate the cities with the states)
    public DbSet<Event> Events { get; set; }

    #endregion
}