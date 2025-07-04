using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApi_Pract.Models;

public partial class UserLogin
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("userid")]
    public int Userid { get; set; }

    [Required]
    [Column("password")]
    [StringLength(500)]
    public string Password { get; set; }

    [ForeignKey("Userid")]
    [InverseProperty("UserLogins")]
    public virtual User User { get; set; }
}
