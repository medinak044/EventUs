using API.Models;

namespace API.Interfaces;

public interface IUnitOfWork : IDisposable
{
    Task<bool> Save();
    IAppUserRepository AppUsers { get; }
}
