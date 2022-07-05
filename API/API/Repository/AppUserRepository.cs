using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository;

public class AppUserRepository : GenericRepository<AppUser>, IAppUserRepository
{
    private readonly DataContext _context;
    public AppUserRepository(DataContext context) : base(context)
    {
        _context = context;
    }


}
