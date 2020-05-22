using Microsoft.EntityFrameworkCore;
using OurGames.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OurGames.Repository
{
    public class CustomerRepository : AbstractRepository<Customer>
    {
        public CustomerRepository(DbContextOptions<OurGamesContext> dbContextOptions) : base(dbContextOptions)
        {
        }

        public bool EmailExists(string email)
        {
            return GetBy(c => c.Email == email).FirstOrDefault() != null;
        }
    }
}
