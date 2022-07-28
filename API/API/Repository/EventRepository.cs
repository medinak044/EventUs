using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository;

public class EventRoleRepository : GenericRepository<EventRole>, IEventRoleRepository
{
    private readonly DataContext _context;
    public EventRoleRepository(DataContext context) : base(context)
    {
        _context = context;
    }

}
