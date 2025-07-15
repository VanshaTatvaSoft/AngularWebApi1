using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Query;

namespace WebApi_Pract.Repository.interfaces;

public interface IGenericRepository<T> where T : class
{
    // IEnumerable<T> GetAll(params Expression<Func<T, object>>[] includes);
    IEnumerable<T> GetAll(Func<IQueryable<T>, IIncludableQueryable<T, object>> includes);

    (IEnumerable<T> records, int totalRecord) GetPagedRecords(
        int pageSize,
        int pageNumber,
        Expression<Func<T, bool>> filter,
        Func<IQueryable<T>, IOrderedQueryable<T>> orderBy
    );

    Task<T?> GetByIdAsync(int id);

    Task AddAsync(T entity);

    Task EditAsync(T entity);

}
