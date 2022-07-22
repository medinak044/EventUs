using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly DataContext _context;

    //public IAppUserRepository AppUsers { get; private set; }

    public UnitOfWork(DataContext context)
    {
        _context = context;

        // Inject the same db context instance into other repositories
        //AppUsers = new AppUserRepository(_context); // (AppUser db data already handled by UserManager because IdentityUser was inherited)
    
    }

    public void Dispose()
    {
        _context.Dispose();
    }

    public async Task<bool> Save()
    {
        var saved = await _context.SaveChangesAsync(); // Returns a number
        return saved > 0 ? true : false;
    }
}
