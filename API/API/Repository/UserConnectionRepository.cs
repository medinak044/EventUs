using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
    public class UserConnectionRepository: GenericRepository<UserConnection>, IUserConnectionRepository
    {
        private readonly DataContext _context;
        public UserConnectionRepository(DataContext context) : base(context)
        {
            _context = context;
        }

    }
}
