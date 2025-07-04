using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApi_Pract.Models;

public partial class Role
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("rolename", TypeName = "character varying")]
    public string Rolename { get; set; }

    [InverseProperty("Role")]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
