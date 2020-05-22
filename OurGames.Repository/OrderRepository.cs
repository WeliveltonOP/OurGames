using Microsoft.EntityFrameworkCore;
using OurGames.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OurGames.Repository
{
    public class OrderRepository : AbstractRepository<Order>
    {
        public OrderRepository(DbContextOptions<OurGamesContext> dbContextOptions) : base(dbContextOptions)
        {
        }

        public IEnumerable<Order> GetByUserUid(string uid)
        {
            return context.Order
                .Include(o => o.Customer)
                .Include(o => o.Game)   
                .Include(o => o.Plataform)   
                .Where(o => o.Customer.ProviderId == uid)
                .ToList();
        }
    }
}
