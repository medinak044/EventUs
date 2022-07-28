using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository;

public class EventRepository: GenericRepository<Event>, IEventRepository
{
    private readonly DataContext _context;
    public EventRepository(DataContext context) : base(context)
    {
        _context = context;
    }

}
