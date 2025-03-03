﻿namespace SPM.Api.Services.Customer.Account.Models
{
    public class RegisterUserRequest
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public bool IsConnected { get; set; }
    }
}
