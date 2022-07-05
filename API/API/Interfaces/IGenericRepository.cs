using System.Linq.Expressions;

namespace API.Interfaces;

public interface IGenericRepository<T> where T : class
{
    Task<T> GetById(int id);
    Task<IEnumerable<T>> GetAll();
    Task<bool> Exists(Expression<Func<T, bool>> predicate);
    Task<bool> Add(T entity); // returns void to separate Save() logic
    Task<bool> Remove(T entity);
    Task<bool> RemoveRange(IEnumerable<T> entity);
    Task<bool> Update(T entity);

}
