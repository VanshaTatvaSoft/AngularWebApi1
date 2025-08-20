using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using WebApi_Pract.Models;
using WebApi_Pract.Repository.interfaces;

namespace WebApi_Pract.Repository.implementation;

public class GenericRepository<T>(WebApiPractContext context) : IGenericRepository<T> where T : class
{
    private readonly WebApiPractContext _context = context;
    private readonly DbSet<T> _dbSet = context.Set<T>();

    // public IEnumerable<T> GetAll(params Expression<Func<T, object>>[] includes)
    // {
    //     IQueryable<T> query = _dbSet;
    //     if (includes != null)
    //     {
    //         foreach(var include in includes)
    //         {
    //             query = query.Include(include);
    //         }
    //     }
    //     return query;
    // }

    public IEnumerable<T> GetAll(Func<IQueryable<T>, IIncludableQueryable<T, object>> includes)
    {
        IQueryable<T> query = _dbSet;
        if (includes != null) query = includes(query);
        return query;
    }

    public (IEnumerable<T> records, int totalRecord) GetPagedRecords(
        int pageSize,
        int pageNumber,
        Expression<Func<T, bool>> filter,
        Func<IQueryable<T>, IOrderedQueryable<T>> orderBy
    )
    {
        if (orderBy == null) throw new ArgumentNullException(nameof(orderBy), "Ordering function cannot be null.");

        IQueryable<T> query = _dbSet;

        if (filter != null) query = query.Where(filter);

        return (orderBy(query).Skip((pageNumber - 1) * pageSize).Take(pageSize), query.Count());
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task AddAsync(T entity)
    {
        if (entity == null) throw new ArgumentNullException(nameof(entity), "Entity cannot be null.");
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task EditAsync(T entity)
    {
        if (entity == null) throw new ArgumentNullException(nameof(entity), "Entity cannot be null.");
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        if (entity == null) throw new ArgumentNullException(nameof(entity), "Entity cannot be null.");
        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteById(int id)
    {
        var entity = await GetByIdAsync(id) ?? throw new KeyNotFoundException($"{typeof(T).Name} with id {id} not found.");
        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task AddRangeSync(IEnumerable<T> entities)
    {
        if (entities == null || !entities.Any()) throw new ArgumentNullException(nameof(entities), "Entities cannot be null or empty.");
        await _dbSet.AddRangeAsync(entities);
        await _context.SaveChangesAsync();
    }

    public async Task EditRangeSync(IEnumerable<T> entities)
    {
        if (entities == null || !entities.Any()) throw new ArgumentNullException(nameof(entities), "Entities cannot be null or empty.");
        _dbSet.UpdateRange(entities);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteRangeSync(IEnumerable<T> entities)
    {
        if (entities == null || !entities.Any()) throw new ArgumentNullException(nameof(entities), "Entities cannot be null or empty.");
        _dbSet.RemoveRange(entities);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<T>> FindAsync(
        Expression<Func<T, bool>> predicates,
        Func<IQueryable<T>, IIncludableQueryable<T, object>>? includes = null
    )
    {
        IQueryable<T> query = _dbSet;
        if (includes != null) query = includes(query);
        return await query.Where(predicates).ToListAsync();
    }

    public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AnyAsync(predicate);
    }

    public async Task SoftDeleteAsync(T entity)
    {
        if (entity == null) throw new ArgumentNullException(nameof(entity), "Entity cannot be null.");
        var property = typeof(T).GetProperty("IsDeleted");
        if (property != null)
        {
            property.SetValue(entity, true);
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }
        else
        {
            throw new InvalidOperationException("Entity does not support soft delete.");
        }
    }



}
