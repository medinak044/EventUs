using API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext: IdentityDbContext<AppUser>
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    #region Tables
    public DbSet<AppUser> AppUsers { get; set; }


    #endregion
}