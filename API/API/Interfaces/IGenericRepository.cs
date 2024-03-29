﻿using System.Linq.Expressions;

namespace API.Interfaces;

public interface IGenericRepository<T> where T : class
{
    Task<T> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
    IEnumerable<T> GetSome(Expression<Func<T, bool>> predicate);
    Task<bool> AddAsync(T entity); // returns void to separate Save() logic
    Task<bool> RemoveAsync(T entity);
    Task<bool> RemoveRangeAsync(IEnumerable<T> entity);
    Task<bool> UpdateAsync(T entity);

}
