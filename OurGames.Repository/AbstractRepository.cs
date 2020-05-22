using Microsoft.EntityFrameworkCore;
using OurGames.Core.Model;
using OurGames.Repository.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OurGames.Repository
{
    public abstract class AbstractRepository<T> : ICrud<T> where T : class
    {
        protected OurGamesContext context;

        public AbstractRepository(DbContextOptions<OurGamesContext> dbContextOptions)
        {
            context = new OurGamesContext(dbContextOptions);
        }

        public virtual T GetByKey(params object[] keyValues)
        {
            return context.Find<T>(keyValues);
        }

        public virtual T Create(T entity)
        {
            context.Add(entity);

            context.SaveChanges();

            return entity;
        }

        public virtual int DeleteBy(Func<T, bool> func)
        {
            var entities = GetBy(func);

            var affectedRows = 0;

            if(entities.Any())
            {
                context.RemoveRange(entities);

                affectedRows = context.SaveChanges();
            }

            return affectedRows;
        }

        public virtual bool DeleteByKey(params object[] keyValues)
        {
            var entity = GetByKey(keyValues);

            var affectedRows = 0;

            if (entity != null)
            {
                context.Remove(entity);

                affectedRows = context.SaveChanges();
            }

            return affectedRows > 0;
        }

        public virtual IEnumerable<T> GetAll()
        {
            return context.Set<T>().ToList();
        }

        public virtual IEnumerable<T> GetBy(Func<T, bool> func)
        {
            return context.Set<T>().Where(func).ToList();
        }

        public virtual T Update(T entity)
        {
            context.Update(entity);

            context.SaveChanges();

            return entity;
        }
    }
}
