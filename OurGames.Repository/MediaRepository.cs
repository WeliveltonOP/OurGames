using Microsoft.EntityFrameworkCore;
using OurGames.Core.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace OurGames.Repository
{
    public class MediaRepository : AbstractRepository<Media>
    {
        public MediaRepository(DbContextOptions<OurGamesContext> dbContextOptions) : base(dbContextOptions)
        {
        }
    }
}
