using Microsoft.EntityFrameworkCore;
using OurGames.Core.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace OurGames.Repository
{
    public class PasswordRequestRepository : AbstractRepository<PasswordRequest>
    {
        public PasswordRequestRepository(DbContextOptions<OurGamesContext> dbContextOptions) : base(dbContextOptions)
        {
        }
    }
}
