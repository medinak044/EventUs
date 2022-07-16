using API.Data;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly DataContext _context;


    public UnitOfWork(DataContext context)
    {
        _context = context;
        // Inject the db context into other repositories
        AppUsers = new AppUserRepository(_context);
    }

    public IAppUserRepository AppUsers { get; private set; }

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
