using Microsoft.EntityFrameworkCore;
using OurGames.Core.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace OurGames.Repository
{
    public class CategoryGameRepository : AbstractRepository<CategoryGame>
    {
        public CategoryGameRepository(DbContextOptions<OurGamesContext> dbContextOptions) : base(dbContextOptions)
        {
        }
    }
}
