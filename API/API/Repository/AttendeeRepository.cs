using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository;

public class AttendeeRepository : GenericRepository<Attendee>, IAttendeeRepository
{
    private readonly DataContext _context;
    public AttendeeRepository(DataContext context) : base(context)
    {
        _context = context;
    }

}
