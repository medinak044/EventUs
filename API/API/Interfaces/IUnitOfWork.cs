﻿using API.Models;

namespace API.Interfaces;

public interface IUnitOfWork : IDisposable
{
    Task<bool> SaveAsync();
    //IAppUserRepository AppUsers { get; }
    IAttendeeRepository Attendees { get; }
    ICheckListItemRepository CheckListItems { get; }
    IEventRepository Events { get; }
    IEventRoleRepository EventRoles { get; }
    IUserConnectionRepository UserConnections { get; }
}
