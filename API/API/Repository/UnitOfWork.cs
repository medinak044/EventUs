using API.Data;
using API.Interfaces;
using API.Models;
using AutoMapper;

namespace API.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UnitOfWork(
        DataContext context,
        IMapper mapper
        )
    {
        _context = context;
        _mapper = mapper;
        //AppUsers = new AppUserRepository(_context); // (AppUser db data already handled by UserManager because IdentityUser was inherited)
    }

    //public IAppUserRepository AppUsers { get; private set; }
    public IAttendeeRepository Attendees => new AttendeeRepository(_context);
    public ICheckListItemRepository CheckListItems => new CheckListItemRepository(_context);
    public IEventRepository Events => new EventRepository(_context);
    public IEventRoleRepository EventRoles => new EventRoleRepository(_context);
    public IUserConnectionRepository UserConnections => new UserConnectionRepository(_context);


    public void Dispose()
    {
        _context.Dispose();
    }

    public async Task<bool> SaveAsync()
    {
        var saved = await _context.SaveChangesAsync(); // Returns a number
        return saved > 0 ? true : false;
    }
}
