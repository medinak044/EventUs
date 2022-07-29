using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository;

public class CheckListItemRepository : GenericRepository<CheckListItem>, ICheckListItemRepository
{
    private readonly DataContext _context;
    public CheckListItemRepository(DataContext context) : base(context)
    {
        _context = context;
    }

}
