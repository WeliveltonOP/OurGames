using System;

namespace OurGames.UI.Models
{
    public class OrderModel
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string GameKey { get; set; }
        public int GameId { get; set; }
        public decimal Value { get; set; }

        public string ThumbnailLink { get; set; }    
        public string Name { get; set; }

        public Plataform Plataform { get; set; }
    }

    public class Plataform
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public static implicit operator Plataform(OurGames.Core.Model.Plataform plataform)
        {
            return new Plataform
            {
                Id = plataform.Id,
                Name = plataform.Name
            };
        }
    }
}
