using Microsoft.EntityFrameworkCore;
using OurGames.Core.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace OurGames.Repository
{
    public class PlataformGameRepository : AbstractRepository<PlataformGame>
    {
        public PlataformGameRepository(DbContextOptions<OurGamesContext> dbContextOptions) : base(dbContextOptions)
        {
        }
    }
}
