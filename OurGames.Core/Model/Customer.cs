﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

namespace OurGames.Core.Model
{
    public partial class Customer
    {
        public Customer()
        {
            CustomerFavorite = new HashSet<CustomerFavorite>();
            CustomerGame = new HashSet<CustomerGame>();
            Order = new HashSet<Order>();
            PasswordRequest = new HashSet<PasswordRequest>();
        }

        public int Id { get; set; }
        public string ProviderId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int AccessLevelId { get; set; }

        public virtual AccessLevel AccessLevel { get; set; }
        public virtual ICollection<CustomerFavorite> CustomerFavorite { get; set; }
        public virtual ICollection<CustomerGame> CustomerGame { get; set; }
        public virtual ICollection<Order> Order { get; set; }
        public virtual ICollection<PasswordRequest> PasswordRequest { get; set; }
    }
}